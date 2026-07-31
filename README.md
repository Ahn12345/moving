# MOVING — 공개 사이트 (2026)

일반 사용자가 보는 프론트엔드입니다.  
콘텐츠 수정은 **`../moving-admin`** 에서 합니다.

## 실행

```bash
# API는 moving-admin backend 먼저 실행
# cd ../moving-admin/backend && npm run dev

cd frontend
npm install
npm run dev     # http://localhost:5173
```

## 링크

| 구분 | 주소 |
|------|------|
| 공개 사이트 | http://localhost:5173 |
| 관리자 | http://localhost:5174 (`Web/moving-admin/frontend`) |
| API | http://localhost:4000 (`Web/moving-admin/backend`) |

공개(5173) / 관리자(5174) / API(4000) 포트가 달라서 URL이 겹치지 않습니다.  
관리자 비밀번호는 `moving-admin/backend/.env` 의 `ADMIN_PASSWORD` 입니다.

`VITE_API_URL` 기본값은 `http://localhost:4000` 입니다.
