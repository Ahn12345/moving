import { useEffect, useState } from "react";
import { api, mediaUrl, PARTS, type Member } from "../api";

export function MemberSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<"ALL" | "SEASON">("ALL");

  useEffect(() => {
    api.getMembers().then(setMembers).catch(() => setMembers([]));
  }, []);

  const byPart = PARTS.map((label) => ({
    label,
    members: members.filter((m) => m.part === label),
  }));

  return (
    <section id="member" className="section-block" style={{ background: "#000000" }}>
      <div className="site-container">
        <div className="section-head-center">
          <h2 className="section-title" style={{ fontSize: "clamp(36px, 6vw, 56px)", letterSpacing: "0.04em" }}>
            MEMBER
          </h2>
          <p className="section-desc ko-text" style={{ marginBottom: 0 }}>
            총 <strong style={{ color: "#00e676" }}>50+</strong>명의 팀원들이 Moving과 함께했어요!
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          {(["ALL", "SEASON"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#00e676" : "transparent",
                color: filter === f ? "#000" : "#9ca3af",
                border: filter === f ? "none" : "1px solid rgba(255,255,255,0.12)",
                borderRadius: 999,
                padding: "8px 20px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="part-grid">
          {byPart.map((part) => (
            <div key={part.label} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", padding: "28px 22px" }}>
              <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", margin: "0 0 8px" }}>
                {part.label}
              </h3>
              <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, color: "#666", margin: "0 0 20px" }}>
                {part.members.length === 0 ? "추후 추가 예정" : `${part.members.length}명`}
              </p>

              {part.members.length === 0 ? (
                <div
                  style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: 13,
                    color: "#555",
                    border: "1px dashed rgba(255,255,255,0.12)",
                    padding: "10px 14px",
                    textAlign: "center",
                  }}
                >
                  멤버 추가 예정
                </div>
              ) : (
                <div className="member-grid">
                  {part.members.map((m) => (
                    <div key={m.id} className="member-card">
                      <div className="member-avatar">
                        {m.photoUrl ? (
                          <img src={mediaUrl(m.photoUrl)} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: "#00e676" }}>
                            {m.name.slice(0, 1)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 14, color: "#f0f0ee", marginBottom: 6 }}>{m.name}</div>
                      {m.role && <span className="member-role-tag">{m.role}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 28, color: "#fff", margin: "0 0 10px" }}>
            함께할수록 즐거운 창업
          </h3>
          <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 15, color: "#9ca3af", margin: 0 }}>
            즐거운 창업 여정을 Moving과 함께 해 보세요!
          </p>
        </div>
      </div>
    </section>
  );
}
