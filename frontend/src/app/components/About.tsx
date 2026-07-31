const activities = [
  { cat: "BASIC", items: ["아이디어 기획", "공모전", "프로젝트", "기획 활동"] },
  { cat: "ACTIVITY", items: ["아이디어 워크숍", "멘토링 세션", "데모데이", "팀 빌딩"] },
  { cat: "SUPPORT", items: ["창업 컨설팅", "법인 설립 가이드", "IR 피칭 코칭", "VC네트워크"] },
  { cat: "NETWORK", items: ["OB·Alumni 연결", "타 동아리 교류", "산업 멘토 매칭", "VC·스타트업 네트워킹"] },
];

const achievements = [
  { year: "2023", title: "교내 창업 경진대회 수상", desc: "Moving 소속 팀 2팀 — 최우수상·우수상" },
  { year: "2024", title: "전국 대학 창업 연합 데모데이", desc: "Moving 팀 3팀 발표 및 IR 피칭" },
  { year: "2024", title: "첫 법인 설립 팀 배출", desc: "시드 투자 유치 및 정식 법인 설립" },
  { year: "2025", title: "멤버 50명+ 달성", desc: "5기·6기 모집, 트랙제 운영 도입" },
  { year: "2026", title: "7기 모집 & 플랫폼 구축", desc: "공식 사이트 백엔드·미디어 관리 시스템 구축" },
];

export function About() {
  return (
    <section id="about" className="section-block" style={{ background: "#0a0a0a" }}>
      <div className="site-container">
        <div className="section-head-left">
          <h2 className="section-title">끊임없이 움직이는 우리의 이야기</h2>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            MOVING은 창업에 관심 있는 대학생을 위한 창업 동아리입니다.
          </p>
        </div>

        <div className="ko-text" style={{ maxWidth: 720, marginBottom: 56 }}>
          <p className="body-lg">
            <strong style={{ color: "#ffffff" }}>MOVING</strong>은 성장하고 싶은 대학생을 위한{" "}
            <strong style={{ color: "#00e676" }}>창업 동아리</strong>입니다.
          </p>
          <p className="body-lg">
            틀에 박힌 이론 공부가 아닌, 직접 기획하고 실행하는{" "}
            <strong style={{ color: "#ffffff" }}>프로젝트형 활동</strong>을 추구합니다.
          </p>
          <p className="body-lg">
            아이디어 워크숍부터 데모데이, IR 피칭까지
            <br className="mobile-br" />
            실전 창업 경험을 쌓을 기회를 제공합니다.
          </p>
          <p className="body-md">팀원들과 함께 사업 아이디어를 발표하고, 멘토링을 통해 피드백을 받으며 성장하세요.</p>
          <p className="body-md" style={{ marginTop: 12 }}>
            <span style={{ whiteSpace: "nowrap" }}>Moving_ 움직이는 중</span>,{" "}
            <span style={{ whiteSpace: "nowrap" }}>Moving-ing ~하는 중!</span>
          </p>
        </div>

        <div className="activity-grid">
          {activities.map((a) => (
            <div key={a.cat} className="activity-card">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: "#00e676", marginBottom: 16 }}>
                {a.cat}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignContent: "flex-start" }}>
                {a.items.map((item) => (
                  <span key={item} className="activity-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="section-head-center">
          <h3 className="section-title">우리가 이룬 업적들</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {achievements.map((a) => (
            <div key={`${a.year}-${a.title}`} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 20px" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.14em", color: "#00e676", marginBottom: 10 }}>
                {a.year}
              </div>
              <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>
                {a.title}
              </div>
              <div className="body-md">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
