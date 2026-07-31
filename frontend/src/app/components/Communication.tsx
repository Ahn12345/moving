import { useEffect, useState } from "react";
import { api, mediaUrl, type Banner, type Notice, type Org } from "../api";

export function Communication() {
  const [tab, setTab] = useState<"notice" | "startups" | "partners">("notice");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [startups, setStartups] = useState<Org[]>([]);
  const [partners, setPartners] = useState<Org[]>([]);
  const [noticeLimit, setNoticeLimit] = useState(5);

  useEffect(() => {
    Promise.all([
      api.getNotices().catch(() => [] as Notice[]),
      api.getStartups().catch(() => [] as Org[]),
      api.getPartners().catch(() => [] as Org[]),
    ]).then(([n, s, p]) => {
      setNotices(n);
      setStartups(s);
      setPartners(p);
    });
  }, []);

  const tabs = [
    { id: "notice" as const, label: "공지사항" },
    { id: "startups" as const, label: "스타트업" },
    { id: "partners" as const, label: "협력사" },
  ];

  return (
    <section id="communication" className="section-block" style={{ background: "#000", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0,230,118,0.05), transparent)", pointerEvents: "none" }} />
      <div className="site-container" style={{ position: "relative", zIndex: 1 }}>
        <div className="section-head-center">
          <h2 className="section-title">COMMUNICATION</h2>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: tab === t.id ? "2px solid #00e676" : "2px solid transparent",
                color: tab === t.id ? "#fff" : "#666",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                padding: "12px 20px 12px 0",
                marginRight: 16,
                marginBottom: -1,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "notice" && (
          <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", background: "#0a0a0a" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px", padding: "10px 20px", background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["분류", "제목", "날짜"].map((h) => (
                <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "#444" }}>{h}</span>
              ))}
            </div>
            {notices.slice(0, noticeLimit).map((n, i) => (
              <div
                key={n.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 100px",
                  padding: "14px 20px",
                  borderBottom: i < Math.min(notices.length, noticeLimit) - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  alignItems: "center",
                }}
              >
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em",
                  color: n.category === "공지" ? "#00e676" : "#6c63ff",
                  border: `1px solid ${n.category === "공지" ? "rgba(0,230,118,0.3)" : "rgba(108,99,255,0.3)"}`,
                  padding: "2px 6px", width: "fit-content",
                }}>{n.category}</span>
                <span className="ko-text" style={{ fontSize: 13, color: n.hot ? "#fff" : "#9ca3af" }}>
                  {n.hot && <span style={{ color: "#00e676", marginRight: 6, fontSize: 11, fontWeight: 600 }}>N</span>}
                  {n.title}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555", textAlign: "right" }}>{n.date}</span>
              </div>
            ))}
            {notices.length > noticeLimit && (
              <div style={{ padding: "12px 20px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => setNoticeLimit((v) => v + 5)}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "8px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", cursor: "pointer" }}
                >
                  더 보기
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "startups" && (
          <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", background: "#0a0a0a", padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "#00e676" }}>START-UP</div>
            </div>
            {startups.length === 0 ? (
              <p style={{ color: "#555", fontSize: 14 }}>등록된 스타트업이 없습니다.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {startups.map((s) => (
                  <div key={s.id} style={{ padding: "16px 18px", border: "1px solid rgba(255,255,255,0.06)", background: "#111" }}>
                    {s.logoUrl && <img src={mediaUrl(s.logoUrl)} alt="" style={{ height: 32, marginBottom: 10, objectFit: "contain" }} />}
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "partners" && (
          <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", background: "#0a0a0a", padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "#6c63ff" }}>PARTNERS</div>
            </div>
            {partners.length === 0 ? (
              <p style={{ color: "#555", fontSize: 14 }}>등록된 협력사가 없습니다.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {partners.map((p) => (
                  <div key={p.id} style={{ padding: "16px 18px", border: "1px solid rgba(255,255,255,0.06)", background: "#111" }}>
                    {p.logoUrl && <img src={mediaUrl(p.logoUrl)} alt="" style={{ height: 32, marginBottom: 10, objectFit: "contain" }} />}
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function AdBanner({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) {
    return (
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d", padding: "28px 0" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "#333", textAlign: "center" }}>
          AD BANNER
        </div>
      </div>
    );
  }

  const loop = [...banners, ...banners, ...banners];

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d", padding: "20px 0", overflow: "hidden" }}>
      <div className="site-container" style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.16em", color: "#333" }}>AD BANNER</div>
      </div>
      <div className="ad-marquee-track">
        {loop.map((b, i) => {
          const inner = (
            <div style={{ width: 280, height: 100, flexShrink: 0, background: "#111", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", position: "relative" }}>
              <img src={mediaUrl(b.imageUrl)} alt={b.title || "ad"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {b.title && (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "6px 10px", background: "linear-gradient(transparent, rgba(0,0,0,0.75))", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ccc" }}>
                  {b.title}
                </div>
              )}
            </div>
          );
          return b.linkUrl ? (
            <a key={`${b.id}-${i}`} href={b.linkUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}>{inner}</a>
          ) : (
            <div key={`${b.id}-${i}`} style={{ flexShrink: 0 }}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
