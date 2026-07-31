import { db } from "./db.js";
import { v4 as uuid } from "uuid";

function clear() {
  for (const t of ["projects", "members", "startups", "partners", "banners", "notices", "timeline_events"]) {
    db.prepare(`DELETE FROM ${t}`).run();
  }
}

function seed() {
  clear();

  const projects = [
    {
      title: "PLANI",
      subtitle: "일정·업무 관리 SaaS",
      desc: "Moving 1기 팀이 창업한 SaaS 서비스. 팀 단위 일정 및 업무 관리 플랫폼으로 현재 실제 서비스 운영 중.",
      tags: ["SaaS", "B2B", "시드 투자"],
      metric: "사용자 1,200명+",
      status: "LIVE",
      color: "#00e676",
      period: "2023.03 – 현재",
      result: "누적 사용자 1,200명 돌파, 시드 투자 유치 성공",
      process: "팀 내 아이디어 워크숍에서 출발해, 3개월 MVP 개발 후 베타 런칭. 실 사용자 피드백 기반으로 기능을 고도화하며 안정적인 구독 매출 구조 확립.",
    },
    {
      title: "FOODMAP",
      subtitle: "로컬 푸드 큐레이션",
      desc: "골목 맛집을 발굴하고 공유하는 로컬 푸드 플랫폼. 교내 창업 경진대회 최우수상 수상작.",
      tags: ["O2O", "커뮤니티", "앱"],
      metric: "🏆 최우수상",
      status: "AWARD",
      color: "#ffd93d",
      period: "2023.09 – 2024.02",
      result: "교내 창업 경진대회 최우수상 수상",
      process: "Moving 3기 팀이 로컬 상권 활성화라는 주제로 기획. 6주간 사용자 인터뷰 50건 및 프로토타입 테스트를 거쳐 경진대회에 출품.",
    },
    {
      title: "AILEARN",
      subtitle: "AI 학습 코치",
      desc: "LLM 기반 개인화 학습 경로 추천 서비스. 전국 대학 연합 데모데이에서 발표.",
      tags: ["AI", "EdTech", "LLM"],
      metric: "데모데이 발표",
      status: "SEED",
      color: "#6c63ff",
      period: "2024.01 – 진행 중",
      result: "전국 대학 연합 데모데이 발표, 투자자 관심 유치",
      process: "OpenAI API를 활용한 커리큘럼 추천 엔진을 2개월 만에 프로토타입으로 개발. 데모데이 발표 후 엔젤 투자자와 초기 미팅 진행 중.",
    },
    {
      title: "GREENLINK",
      subtitle: "친환경 소비 플랫폼",
      desc: "탄소 발자국을 줄이는 소비를 유도하는 리워드 기반 친환경 쇼핑 플랫폼.",
      tags: ["ESG", "리워드", "소셜임팩트"],
      metric: null,
      status: "WIP",
      color: "#4ecdc4",
      period: "2024.06 – 진행 중",
      result: "추후 업데이트 예정",
      process: "Moving 4기 팀 프로젝트. 사회적 기업 인증 트랙을 목표로 기획 단계 진행 중.",
    },
    {
      title: "DEVMATE",
      subtitle: "개발자 팀빌딩 매칭",
      desc: "사이드 프로젝트나 창업 아이디어를 함께할 팀원을 찾는 매칭 플랫폼.",
      tags: ["매칭", "커뮤니티", "개발자"],
      metric: "베타 운영 중",
      status: "BETA",
      color: "#ff6b6b",
      period: "2025.01 – 진행 중",
      result: "베타 버전 운영 중, 매칭 성사 20건+",
      process: "Moving 내부 팀빌딩 과정에서 불편함을 느껴 직접 만든 서비스. 현재 베타 유저 확보 후 기능 고도화 중.",
    },
    {
      title: "MOVING SITE",
      subtitle: "동아리 공식 사이트",
      desc: "Moving 창업 동아리의 공식 웹사이트. 동아리 소개, 연혁, 활동을 소개합니다.",
      tags: ["React", "Node.js"],
      metric: "지금 보는 페이지",
      status: "LIVE",
      color: "#00e676",
      period: "2025.06 – 2026",
      result: "공식 사이트 오픈 및 백엔드 연동",
      process: "팀 내에서 직접 디자인·개발. Swiss 디자인 시스템 기반, DB·미디어 업로드 지원.",
    },
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, subtitle, desc, tags, metric, status, color, period, result, process, sort_order)
    VALUES (@id, @title, @subtitle, @desc, @tags, @metric, @status, @color, @period, @result, @process, @sort_order)
  `);

  projects.forEach((p, i) => {
    insertProject.run({
      id: uuid(),
      ...p,
      tags: JSON.stringify(p.tags),
      sort_order: i,
    });
  });

  const insertMember = db.prepare(`
    INSERT INTO members (id, name, part, role, sort_order) VALUES (?, ?, ?, ?, ?)
  `);
  const sampleMembers = [
    ["김민수", "기획 파트", "파트장", 0],
    ["이서연", "기획 파트", "", 1],
    ["박준혁", "개발 파트", "파트장", 0],
    ["최유진", "개발 파트", "", 1],
    ["정하은", "디자인 파트", "파트장", 0],
    ["한도윤", "마케팅 파트", "파트장", 0],
    ["오세린", "경영·재무 파트", "파트장", 0],
  ];
  sampleMembers.forEach(([name, part, role, order]) => {
    insertMember.run(uuid(), name, part, role, order);
  });

  const insertStartup = db.prepare(`
    INSERT INTO startups (id, name, desc, sort_order) VALUES (?, ?, ?, ?)
  `);
  [
    ["PLANI", "일정·업무 관리 SaaS"],
    ["FOODMAP", "로컬 푸드 큐레이션"],
  ].forEach(([name, desc], i) => insertStartup.run(uuid(), name, desc, i));

  const insertPartner = db.prepare(`
    INSERT INTO partners (id, name, desc, sort_order) VALUES (?, ?, ?, ?)
  `);
  [
    ["대학 창업지원단", "멘토링 · 공간 지원"],
    ["지역 VC 네트워크", "투자 연계"],
  ].forEach(([name, desc], i) => insertPartner.run(uuid(), name, desc, i));

  const insertNotice = db.prepare(`
    INSERT INTO notices (id, category, title, date, hot, sort_order) VALUES (?, ?, ?, ?, ?, ?)
  `);
  [
    ["공지", "2026 Moving 7기 신입 모집 안내", "2026.03.01", 1],
    ["활동", "2월 아이디어톤 결과 공유", "2026.02.20", 0],
    ["공지", "정기 세션 일정 변경 안내", "2026.02.10", 0],
    ["활동", "1월 멘토링 세션 후기", "2026.01.28", 0],
    ["공지", "Moving 동아리방 이용 안내", "2026.01.15", 0],
  ].forEach(([category, title, date, hot], i) => {
    insertNotice.run(uuid(), category, title, date, hot, i);
  });

  const insertTimeline = db.prepare(`
    INSERT INTO timeline_events (id, year, title, desc, tags, metric, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const timeline = [
    ["2022", "Moving 창단", "창업에 관심 있는 학생 12명이 모여 Moving 동아리를 창단. 첫 킥오프 미팅과 비전 수립.", ["창단", "킥오프", "비전"], "창단 멤버 12명", 0],
    ["2022", "첫 아이디어톤 개최", "동아리 내부 아이디어톤을 개최해 10개 팀이 사업 아이디어를 발표하고 피드백을 교환.", ["아이디어톤", "피칭"], "10팀 참가", 1],
    ["2023", "멤버 30명 돌파", "적극적인 리크루팅과 입소문을 통해 멤버 30명 달성. 전공 다양성 확보 (공학·경영·디자인).", ["성장", "리크루팅"], "멤버 30명+", 0],
    ["2023", "교내 창업 경진대회 수상", "Moving 소속 팀 2팀이 교내 창업 경진대회에서 각각 최우수상·우수상 수상.", ["수상", "경진대회"], "🏆 최우수상 수상", 1],
    ["2023", "외부 멘토링 프로그램 도입", "현직 창업자 및 VC 심사역을 초청해 월 1회 멘토링 세션 정례화. 실전 피드백 체계 구축.", ["멘토링", "네트워킹"], null, 2],
    ["2024", "첫 법인 설립 팀 배출", "Moving 출신 팀이 졸업 후 정식 법인을 설립. 시드 투자 유치 성공.", ["법인 설립", "투자 유치"], "시드 투자 유치", 0],
    ["2024", "전국 대학 창업 연합 참여", "타 대학 창업 동아리와 연합 데모데이를 공동 개최. Moving 팀 3팀 발표.", ["데모데이", "연합"], "3팀 발표", 1],
    ["2025", "멤버 50명+ & 신규 기수 모집", "5기 모집을 통해 전체 멤버 50명 돌파. 기수별 트랙제 운영 도입 (아이디어 / 실전 / OB).", ["5기", "트랙제"], "멤버 50명+", 0],
    ["2025", "공식 사이트 오픈", "Moving 공식 웹사이트를 오픈하고 활동·프로젝트를 온라인으로 공유.", ["사이트", "브랜딩"], "공식 사이트", 1],
    ["2026", "7기 신입 모집", "Moving 7기 멤버를 모집합니다. 창업에 관심 있다면 누구든 환영합니다.", ["모집 중", "7기"], "지금 지원하세요", 0],
    ["2026", "백엔드·미디어 플랫폼 구축", "결과물(이미지·영상)을 관리할 수 있는 백엔드와 관리자 페이지를 구축.", ["플랫폼", "DB"], "미디어 업로드", 1],
  ];
  timeline.forEach(([year, title, desc, tags, metric, order]) => {
    insertTimeline.run(uuid(), year, title, desc, JSON.stringify(tags), metric, order);
  });

  console.log("Seed complete.");
}

seed();
