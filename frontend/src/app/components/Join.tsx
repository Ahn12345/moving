import { useState } from "react";

const tags = ["# 창업 동아리", "# 아이디어톤", "# 데모데이", "# 멘토링", "# 실전 창업", "# Moving_", "# 꿈을 현실로", "# 함께 움직이는 중"];

export function Join() {
  const [copied, setCopied] = useState(false);
  const EMAIL = "moving@example.com";
  const INSTAGRAM = "@mov_ing_2026";
  const INSTAGRAM_URL = "https://www.instagram.com/mov_ing_2026";

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="join" className="section-block" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="site-container" style={{ textAlign: "center" }}>
        <h2
          className="ko-text"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "#fff",
            margin: "0 0 16px",
          }}
        >
          저희는 계속해서 발전하는 중이에요!
        </h2>
        <p className="ko-text" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 16, color: "#9ca3af", margin: "0 0 40px", lineHeight: 1.75 }}>
          2026년 7기 신입 멤버를 모집하고 있습니다. 창업에 관심 있다면 누구든 환영합니다.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 64 }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: 13,
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999,
                padding: "8px 16px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "left", background: "#111", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 28px" }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", margin: "0 0 12px", textAlign: "center" }}>
            함께 <span style={{ color: "#00e676" }}>MOVING</span> 하실래요?
          </h3>
          <p className="ko-text" style={{ fontSize: 14, color: "#9ca3af", textAlign: "center", margin: "0 0 28px", lineHeight: 1.75 }}>
            가입 문의, 협업 제안, 멘토링 신청 등 무엇이든 편하게 연락해 주세요.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button
              onClick={copyEmail}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "#555", marginBottom: 6 }}>EMAIL</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#ffffff" }}>{EMAIL}</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: copied ? "#00e676" : "#9ca3af" }}>
                {copied ? "COPIED ✓" : "COPY"}
              </span>
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: "#555", marginBottom: 6 }}>INSTAGRAM</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#ffffff" }}>{INSTAGRAM}</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#00e676" }}>VISIT →</span>
            </a>
          </div>

          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#555", textAlign: "center", margin: "24px 0 0" }}>
            더 알고 싶다면 CLICK!
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px" }}>
      <div className="site-container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.08em", color: "#fff" }}>MOVING</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.06em" }}>
          © 2026 MOVING. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
