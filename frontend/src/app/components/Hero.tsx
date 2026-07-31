export function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,230,118,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.2em", color: "#00e676", marginBottom: 24 }}>
          STARTUP CLUB · SINCE 2022
        </p>

        <h1
          className="ko-text"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(48px, 10vw, 96px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: "0 0 28px",
          }}
        >
          아이디어에서 창업까지,
          <br />
          <span style={{ color: "#00e676" }}>함께 움직이는</span> 이야기
        </h1>

        <p
          className="ko-text"
          style={{
            fontFamily: "'Noto Sans KR', 'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(16px, 2.5vw, 18px)",
            color: "#d1d5db",
            lineHeight: 1.85,
            maxWidth: 520,
            margin: "0 auto 48px",
          }}
        >
          MOVING은 창업에 관심 있는 대학생을 위한 창업 동아리입니다.
          <br />
          아이디어 기획부터 프로젝트 실행, 실전 창업까지 함께 나아갑니다.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginBottom: 64 }}>
          {[
            { value: "50+", label: "MEMBERS" },
            { value: "10+", label: "STARTUPS" },
            { value: "7기", label: "RECRUITING" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 40, color: "#ffffff", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", color: "#9ca3af", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#d1d5db",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            padding: "12px 28px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,230,118,0.4)";
            e.currentTarget.style.color = "#00e676";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "#d1d5db";
          }}
        >
          더 알아보기 ↓
        </button>
      </div>
    </section>
  );
}
