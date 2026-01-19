# Health Finance App

평생 건강·재무 관리 AI 앱

건강 데이터 관리와 AI 챗봇을 통한 건강 상담, 그리고 건강 적립금 시스템을 제공하는 모바일 앱입니다.

## 프로젝트 구조

```
health-finance-app/
├── backend/          # Express.js 백엔드 서버
├── frontend/         # React Native (Expo) 프론트엔드
└── README.md
```

## 백엔드 설정

### 설치

```bash
cd backend
npm install
```

### 환경 설정

`backend/.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-random-secret-key-change-this
PORT=3000
```

### 데이터베이스 설정

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 실행

```bash
cd backend
npm run dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 프론트엔드 설정

### 설치

```bash
cd frontend
npm install
```

### 실행

```bash
cd frontend
npm start
```

또는 웹 모드로 실행:

```bash
cd frontend
npm start -- --web
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 대화
- `POST /api/conversations` - 대화 전송
- `GET /api/conversations/history/:userId` - 대화 히스토리

### 건강 데이터
- `POST /api/health/records` - 건강 데이터 입력
- `GET /api/health/records/:userId` - 건강 기록 조회

### 구독/적립
- `POST /api/subscriptions` - 적립 시작
- `GET /api/subscriptions/:userId` - 적립 현황

## 기술 스택

### 백엔드
- Node.js + Express
- Prisma (SQLite)
- Socket.io
- Claude AI API

### 프론트엔드
- React Native
- Expo
- React Navigation

## 주의사항

⚠️ **중요**: `.env` 파일은 Git에 커밋되지 않습니다. 프로젝트를 클론한 후 `.env` 파일을 직접 생성하고 필요한 API 키를 설정해야 합니다.
