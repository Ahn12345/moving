import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import { db, uploadsDir } from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "moving2026";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "관리자 인증이 필요합니다." });
  }
  next();
}

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
  }
  res.json({ ok: true, token: ADMIN_PASSWORD });
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image|video)\//.test(file.mimetype);
    cb(ok ? null : new Error("이미지 또는 영상만 업로드할 수 있습니다."), ok);
  },
});

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    desc: row.desc,
    tags: parseTags(row.tags),
    metric: row.metric,
    status: row.status,
    color: row.color,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    sortOrder: row.sort_order,
    detail: {
      period: row.period,
      result: row.result,
      process: row.process,
    },
  };
}

// ── Upload ────────────────────────────────────────────────────
app.post("/api/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "파일이 없습니다." });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, mimetype: req.file.mimetype });
});

// ── Projects (달려온 결과) ─────────────────────────────────────
app.get("/api/projects", (_req, res) => {
  const rows = db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC").all();
  res.json(rows.map(mapProject));
});

app.get("/api/projects/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(mapProject(row));
});

app.post("/api/projects", requireAdmin, (req, res) => {
  const {
    title, subtitle = "", desc = "", tags = [], metric = null,
    status = "WIP", color = "#00e676", period = "", result = "",
    process = "", imageUrl = null, videoUrl = null, sortOrder = 0,
  } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const id = uuid();
  db.prepare(`
    INSERT INTO projects (id, title, subtitle, desc, tags, metric, status, color, period, result, process, image_url, video_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, subtitle, desc, JSON.stringify(parseTags(tags)), metric, status, color, period, result, process, imageUrl, videoUrl, sortOrder);
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  res.status(201).json(mapProject(row));
});

app.put("/api/projects/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare(`
    UPDATE projects SET
      title = ?, subtitle = ?, desc = ?, tags = ?, metric = ?, status = ?, color = ?,
      period = ?, result = ?, process = ?, image_url = ?, video_url = ?, sort_order = ?
    WHERE id = ?
  `).run(
    b.title ?? existing.title,
    b.subtitle ?? existing.subtitle,
    b.desc ?? existing.desc,
    JSON.stringify(parseTags(b.tags ?? existing.tags)),
    b.metric !== undefined ? b.metric : existing.metric,
    b.status ?? existing.status,
    b.color ?? existing.color,
    b.period ?? existing.period,
    b.result ?? existing.result,
    b.process ?? existing.process,
    b.imageUrl !== undefined ? b.imageUrl : existing.image_url,
    b.videoUrl !== undefined ? b.videoUrl : existing.video_url,
    b.sortOrder ?? existing.sort_order,
    req.params.id,
  );
  res.json(mapProject(db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id)));
});

app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Members ────────────────────────────────────────────────────
app.get("/api/members", (_req, res) => {
  const rows = db.prepare("SELECT * FROM members ORDER BY part ASC, sort_order ASC, created_at ASC").all();
  res.json(rows.map((r) => ({
    id: r.id, name: r.name, part: r.part, role: r.role, photoUrl: r.photo_url, sortOrder: r.sort_order,
  })));
});

app.post("/api/members", requireAdmin, (req, res) => {
  const { name, part, role = "", photoUrl = null, sortOrder = 0 } = req.body;
  if (!name || !part) return res.status(400).json({ error: "name and part required" });
  const id = uuid();
  db.prepare("INSERT INTO members (id, name, part, role, photo_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(id, name, part, role, photoUrl, sortOrder);
  const r = db.prepare("SELECT * FROM members WHERE id = ?").get(id);
  res.status(201).json({ id: r.id, name: r.name, part: r.part, role: r.role, photoUrl: r.photo_url, sortOrder: r.sort_order });
});

app.put("/api/members/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM members WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare("UPDATE members SET name = ?, part = ?, role = ?, photo_url = ?, sort_order = ? WHERE id = ?").run(
    b.name ?? existing.name,
    b.part ?? existing.part,
    b.role ?? existing.role,
    b.photoUrl !== undefined ? b.photoUrl : existing.photo_url,
    b.sortOrder ?? existing.sort_order,
    req.params.id,
  );
  const r = db.prepare("SELECT * FROM members WHERE id = ?").get(req.params.id);
  res.json({ id: r.id, name: r.name, part: r.part, role: r.role, photoUrl: r.photo_url, sortOrder: r.sort_order });
});

app.delete("/api/members/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Startups ───────────────────────────────────────────────────
function mapOrg(r) {
  return { id: r.id, name: r.name, desc: r.desc, logoUrl: r.logo_url, linkUrl: r.link_url, sortOrder: r.sort_order };
}

app.get("/api/startups", (_req, res) => {
  res.json(db.prepare("SELECT * FROM startups ORDER BY sort_order ASC, created_at ASC").all().map(mapOrg));
});

app.post("/api/startups", requireAdmin, (req, res) => {
  const { name, desc = "", logoUrl = null, linkUrl = null, sortOrder = 0 } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const id = uuid();
  db.prepare("INSERT INTO startups (id, name, desc, logo_url, link_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(id, name, desc, logoUrl, linkUrl, sortOrder);
  res.status(201).json(mapOrg(db.prepare("SELECT * FROM startups WHERE id = ?").get(id)));
});

app.put("/api/startups/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM startups WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare("UPDATE startups SET name = ?, desc = ?, logo_url = ?, link_url = ?, sort_order = ? WHERE id = ?").run(
    b.name ?? existing.name, b.desc ?? existing.desc,
    b.logoUrl !== undefined ? b.logoUrl : existing.logo_url,
    b.linkUrl !== undefined ? b.linkUrl : existing.link_url,
    b.sortOrder ?? existing.sort_order, req.params.id,
  );
  res.json(mapOrg(db.prepare("SELECT * FROM startups WHERE id = ?").get(req.params.id)));
});

app.delete("/api/startups/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM startups WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Partners ───────────────────────────────────────────────────
app.get("/api/partners", (_req, res) => {
  res.json(db.prepare("SELECT * FROM partners ORDER BY sort_order ASC, created_at ASC").all().map(mapOrg));
});

app.post("/api/partners", requireAdmin, (req, res) => {
  const { name, desc = "", logoUrl = null, linkUrl = null, sortOrder = 0 } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const id = uuid();
  db.prepare("INSERT INTO partners (id, name, desc, logo_url, link_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(id, name, desc, logoUrl, linkUrl, sortOrder);
  res.status(201).json(mapOrg(db.prepare("SELECT * FROM partners WHERE id = ?").get(id)));
});

app.put("/api/partners/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM partners WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare("UPDATE partners SET name = ?, desc = ?, logo_url = ?, link_url = ?, sort_order = ? WHERE id = ?").run(
    b.name ?? existing.name, b.desc ?? existing.desc,
    b.logoUrl !== undefined ? b.logoUrl : existing.logo_url,
    b.linkUrl !== undefined ? b.linkUrl : existing.link_url,
    b.sortOrder ?? existing.sort_order, req.params.id,
  );
  res.json(mapOrg(db.prepare("SELECT * FROM partners WHERE id = ?").get(req.params.id)));
});

app.delete("/api/partners/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM partners WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Banners ────────────────────────────────────────────────────
app.get("/api/banners", (_req, res) => {
  const rows = db.prepare("SELECT * FROM banners WHERE active = 1 ORDER BY sort_order ASC, created_at ASC").all();
  res.json(rows.map((r) => ({
    id: r.id, title: r.title, imageUrl: r.image_url, linkUrl: r.link_url, sortOrder: r.sort_order, active: !!r.active,
  })));
});

app.get("/api/banners/all", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM banners ORDER BY sort_order ASC, created_at ASC").all();
  res.json(rows.map((r) => ({
    id: r.id, title: r.title, imageUrl: r.image_url, linkUrl: r.link_url, sortOrder: r.sort_order, active: !!r.active,
  })));
});

app.post("/api/banners", requireAdmin, (req, res) => {
  const { title = "", imageUrl, linkUrl = null, sortOrder = 0, active = true } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });
  const id = uuid();
  db.prepare("INSERT INTO banners (id, title, image_url, link_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)").run(
    id, title, imageUrl, linkUrl, sortOrder, active ? 1 : 0,
  );
  const r = db.prepare("SELECT * FROM banners WHERE id = ?").get(id);
  res.status(201).json({ id: r.id, title: r.title, imageUrl: r.image_url, linkUrl: r.link_url, sortOrder: r.sort_order, active: !!r.active });
});

app.put("/api/banners/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM banners WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare("UPDATE banners SET title = ?, image_url = ?, link_url = ?, sort_order = ?, active = ? WHERE id = ?").run(
    b.title ?? existing.title,
    b.imageUrl ?? existing.image_url,
    b.linkUrl !== undefined ? b.linkUrl : existing.link_url,
    b.sortOrder ?? existing.sort_order,
    b.active !== undefined ? (b.active ? 1 : 0) : existing.active,
    req.params.id,
  );
  const r = db.prepare("SELECT * FROM banners WHERE id = ?").get(req.params.id);
  res.json({ id: r.id, title: r.title, imageUrl: r.image_url, linkUrl: r.link_url, sortOrder: r.sort_order, active: !!r.active });
});

app.delete("/api/banners/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM banners WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Notices ────────────────────────────────────────────────────
app.get("/api/notices", (_req, res) => {
  const rows = db.prepare("SELECT * FROM notices ORDER BY sort_order ASC, date DESC").all();
  res.json(rows.map((r) => ({
    id: r.id, category: r.category, title: r.title, date: r.date, hot: !!r.hot, sortOrder: r.sort_order,
  })));
});

app.post("/api/notices", requireAdmin, (req, res) => {
  const { category = "공지", title, date, hot = false, sortOrder = 0 } = req.body;
  if (!title || !date) return res.status(400).json({ error: "title and date required" });
  const id = uuid();
  db.prepare("INSERT INTO notices (id, category, title, date, hot, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(
    id, category, title, date, hot ? 1 : 0, sortOrder,
  );
  const r = db.prepare("SELECT * FROM notices WHERE id = ?").get(id);
  res.status(201).json({ id: r.id, category: r.category, title: r.title, date: r.date, hot: !!r.hot, sortOrder: r.sort_order });
});

app.put("/api/notices/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM notices WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare("UPDATE notices SET category = ?, title = ?, date = ?, hot = ?, sort_order = ? WHERE id = ?").run(
    b.category ?? existing.category,
    b.title ?? existing.title,
    b.date ?? existing.date,
    b.hot !== undefined ? (b.hot ? 1 : 0) : existing.hot,
    b.sortOrder ?? existing.sort_order,
    req.params.id,
  );
  const r = db.prepare("SELECT * FROM notices WHERE id = ?").get(req.params.id);
  res.json({ id: r.id, category: r.category, title: r.title, date: r.date, hot: !!r.hot, sortOrder: r.sort_order });
});

app.delete("/api/notices/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM notices WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ── Timeline ───────────────────────────────────────────────────
app.get("/api/timeline", (_req, res) => {
  const rows = db.prepare("SELECT * FROM timeline_events ORDER BY year ASC, sort_order ASC").all();
  const byYear = {};
  for (const r of rows) {
    if (!byYear[r.year]) byYear[r.year] = { year: r.year, items: [] };
    byYear[r.year].items.push({
      id: r.id,
      title: r.title,
      desc: r.desc,
      tags: parseTags(r.tags),
      metric: r.metric,
      sortOrder: r.sort_order,
    });
  }
  res.json(Object.values(byYear));
});

app.post("/api/timeline", requireAdmin, (req, res) => {
  const { year, title, desc = "", tags = [], metric = null, sortOrder = 0 } = req.body;
  if (!year || !title) return res.status(400).json({ error: "year and title required" });
  const id = uuid();
  db.prepare("INSERT INTO timeline_events (id, year, title, desc, tags, metric, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    id, year, title, desc, JSON.stringify(parseTags(tags)), metric, sortOrder,
  );
  res.status(201).json({ id, year, title, desc, tags: parseTags(tags), metric, sortOrder });
});

app.put("/api/timeline/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM timeline_events WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  db.prepare("UPDATE timeline_events SET year = ?, title = ?, desc = ?, tags = ?, metric = ?, sort_order = ? WHERE id = ?").run(
    b.year ?? existing.year,
    b.title ?? existing.title,
    b.desc ?? existing.desc,
    JSON.stringify(parseTags(b.tags ?? existing.tags)),
    b.metric !== undefined ? b.metric : existing.metric,
    b.sortOrder ?? existing.sort_order,
    req.params.id,
  );
  const r = db.prepare("SELECT * FROM timeline_events WHERE id = ?").get(req.params.id);
  res.json({
    id: r.id, year: r.year, title: r.title, desc: r.desc, tags: parseTags(r.tags), metric: r.metric, sortOrder: r.sort_order,
  });
});

app.delete("/api/timeline/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM timeline_events WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) => res.json({ ok: true, year: 2026 }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Moving API running on http://localhost:${PORT}`);
});
