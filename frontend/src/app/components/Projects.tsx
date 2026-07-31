import { useEffect, useState } from "react";
import { api, mediaUrl, type Project } from "../api";

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <div style={{ height: 3, background: project.color }} />
        {(project.imageUrl || project.videoUrl) && (
          <div style={{ background: "#0a0a0a" }}>
            {project.videoUrl ? (
              <video src={mediaUrl(project.videoUrl)} controls style={{ width: "100%", maxHeight: 320, display: "block", objectFit: "cover" }} />
            ) : (
              <img src={mediaUrl(project.imageUrl)} alt={project.title} style={{ width: "100%", maxHeight: 320, display: "block", objectFit: "cover" }} />
            )}
          </div>
        )}
        <div style={{ padding: 32 }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", border: "none", color: "#aaa", fontSize: 20, cursor: "pointer", width: 32, height: 32 }}>×</button>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555" }}>{String((project.sortOrder ?? 0) + 1).padStart(2, "0")}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: project.color, border: `1px solid ${project.color}`, padding: "2px 8px" }}>{project.status}</span>
          </div>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 36, color: project.color, margin: "0 0 4px" }}>{project.title}</h3>
          <div style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>{project.subtitle}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: "0.14em" }}>PERIOD</div>
              <div style={{ color: "#aaa", fontSize: 14 }}>{project.detail.period}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: "0.14em" }}>RESULT</div>
              <div style={{ color: "#f0f0ee", fontSize: 14 }}>{project.detail.result}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: "0.14em" }}>HOW WE DID IT</div>
              <div className="ko-text" style={{ color: "#888", fontSize: 14 }}>{project.detail.process}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function statusColor(status: string) {
  if (status === "LIVE") return "#00e676";
  if (status === "AWARD") return "#ffd93d";
  if (status === "SEED") return "#6c63ff";
  if (status === "BETA") return "#ff6b6b";
  return "#888";
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <section id="project" className="section-block" style={{ background: "#0a0a0a" }}>
      <div className="site-container">
        <div className="section-head-center">
          <h2 className="section-title">달려온 결과</h2>
          <p className="section-desc" style={{ marginBottom: 0 }}>저희가 만든 프로젝트, 궁금하신가요?</p>
        </div>

        <div className="project-grid">
          {projects.map((p, i) => {
            const color = statusColor(p.status);
            return (
              <div
                key={p.id}
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer", transition: "border-color 0.2s" }}
                onClick={() => setSelected(p)}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,230,118,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              >
                {(p.imageUrl || p.videoUrl) && (
                  <div style={{ height: 160, background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
                    {p.imageUrl ? (
                      <img src={mediaUrl(p.imageUrl)} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <video src={mediaUrl(p.videoUrl)} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    {p.videoUrl && (
                      <span style={{ position: "absolute", bottom: 10, right: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, background: "#00e676", color: "#000", padding: "3px 8px" }}>VIDEO</span>
                    )}
                  </div>
                )}
                <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#555" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.12em", color, border: `1px solid ${color}`, padding: "2px 8px" }}>{p.status}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", margin: "0 0 4px", lineHeight: 1 }}>{p.title}</h3>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>{p.subtitle}</div>
                  <p className="ko-text" style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 20px", flex: 1 }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555", background: "#1a1a1a", padding: "2px 8px" }}>{t}</span>
                      ))}
                    </div>
                    <button type="button" style={{ background: "none", border: "none", color: "#00e676", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.08em", cursor: "pointer", whiteSpace: "nowrap", padding: 0 }}>
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
