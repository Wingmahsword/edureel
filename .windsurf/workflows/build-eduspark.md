---
description: EduSpark Full Stack Build — Backend (FastAPI) + Frontend (Next.js)
---

# EduSpark Build Workflow

## Stack Overview
- **Frontend**: Next.js 14 (App Router) + TailwindCSS + shadcn/ui + Framer Motion
- **Backend**: FastAPI (Python) + PostgreSQL + Redis + Celery
- **AI Layer**: OpenAI API (courses, Q&A, personalization)
- **Auth**: Clerk (social + email)
- **Media**: Cloudinary (video/image uploads)
- **Hosting**: Vercel (frontend) · Railway/Render (backend)
- **DB**: Supabase (Postgres + Storage)

---

## Phase 1 — Project Setup

1. Create monorepo structure:
   ```
   eduspark/
   ├── apps/
   │   ├── web/          (Next.js frontend)
   │   └── api/          (FastAPI backend)
   ├── packages/
   │   └── shared/       (types, constants)
   └── .windsurf/
   ```

2. Initialize `apps/web` with:
   ```
   npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir
   ```

3. Initialize `apps/api` with:
   ```
   cd apps/api && python -m venv venv && pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary redis celery openai cloudinary clerk-sdk-python
   ```

---

## Phase 2 — Backend (FastAPI)

### 2.1 Project Structure
```
apps/api/
├── main.py
├── core/
│   ├── config.py        (env vars, settings)
│   ├── database.py      (SQLAlchemy engine)
│   └── security.py      (JWT, Clerk validation)
├── models/
│   ├── user.py
│   ├── course.py
│   ├── lesson.py
│   ├── enrollment.py
│   └── progress.py
├── routers/
│   ├── auth.py
│   ├── courses.py
│   ├── lessons.py
│   ├── feed.py          (Instagram-style feed)
│   ├── ai.py            (AI tutor, quiz gen)
│   └── users.py
├── services/
│   ├── ai_service.py    (OpenAI integration)
│   ├── media_service.py (Cloudinary)
│   └── feed_service.py  (personalized feed algorithm)
├── schemas/             (Pydantic models)
├── alembic/             (DB migrations)
└── requirements.txt
```

### 2.2 Key API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/feed` | Personalized course/lesson feed |
| GET | `/courses` | Browse all courses |
| POST | `/courses` | Create a course (instructor) |
| GET | `/courses/{id}/lessons` | Get lessons |
| POST | `/ai/ask` | AI tutor Q&A |
| POST | `/ai/generate-quiz` | AI quiz generation |
| POST | `/ai/summarize` | Lesson summary |
| POST | `/enrollments` | Enroll in course |
| GET | `/users/me/progress` | Learning progress |

### 2.3 Database Schema (Supabase/Postgres)
- `users` — id, clerk_id, name, avatar, bio, role (student/instructor)
- `courses` — id, title, description, thumbnail, instructor_id, tags, difficulty, is_published
- `lessons` — id, course_id, title, content, video_url, order, duration
- `enrollments` — user_id, course_id, enrolled_at
- `progress` — user_id, lesson_id, completed, completed_at
- `ai_interactions` — user_id, lesson_id, question, answer, created_at

### 2.4 Feed Algorithm
- Score = (recency × 0.3) + (popularity × 0.3) + (user_interest_match × 0.4)
- Tags-based collaborative filtering
- Trending boost (enrollments in last 24h)

---

## Phase 3 — Frontend (Next.js)

### 3.1 Pages & Routes
```
apps/web/src/app/
├── page.tsx              (Landing page — marketing)
├── (auth)/
│   ├── sign-in/
│   └── sign-up/
├── (app)/
│   ├── feed/             (Instagram-style scroll)
│   ├── explore/          (Browse courses)
│   ├── course/[id]/      (Course detail)
│   ├── learn/[lessonId]/ (Lesson player)
│   ├── ai-tutor/         (Chat with AI)
│   ├── profile/[id]/
│   └── dashboard/        (Progress, enrolled)
└── (instructor)/
    ├── studio/           (Course creator)
    └── analytics/
```

### 3.2 Key Components
- `<FeedCard />` — swipeable lesson card (like Instagram Reels)
- `<CourseCard />` — minimal premium course card
- `<LessonPlayer />` — video + notes + AI Q&A sidebar
- `<AITutorChat />` — floating chat interface
- `<ProgressRing />` — animated progress indicator
- `<StreakCounter />` — gamification (daily streak)
- `<QuizModal />` — AI-generated quiz overlay

### 3.3 Design System
**Color Psychology (Conversion-Optimized)**
- Primary: `#7C3AED` (Violet-600) — trust, intelligence, creativity
- Accent: `#F59E0B` (Amber-500) — urgency, CTA, highlights
- Success: `#10B981` (Emerald-500) — progress, achievement
- Background: `#09090B` (Zinc-950) — premium dark mode
- Surface: `#18181B` (Zinc-900) — card surfaces
- Text Primary: `#FAFAFA`
- Text Muted: `#A1A1AA`

**Typography**
- Headings: `Inter` (variable, 700/800)
- Body: `Inter` (400/500)

**UX Principles**
- Dark-first, glassmorphism cards
- Micro-animations on every interaction (Framer Motion)
- Progress bars always visible (Zeigarnik effect)
- Social proof counters (enrolled students, ratings)
- FOMO triggers (X students enrolled today)

---

## Phase 4 — AI Features

### 4.1 AI Tutor
- Context-aware Q&A per lesson (OpenAI GPT-4o)
- Conversation history per lesson session
- Suggested follow-up questions

### 4.2 AI Quiz Generator
- Auto-generate MCQ quiz from lesson content
- Spaced repetition reminders
- Weak area detection

### 4.3 AI Course Generator (Instructor)
- Provide topic → AI generates course outline + lessons
- AI writes lesson content drafts

### 4.4 Personalized Feed
- Tag interest profiling from first 3 interactions
- Reinforcement learning-lite: boost cards user dwells on

---

## Phase 5 — Deployment

### 5.1 Frontend → Vercel
```bash
cd apps/web
vercel --prod
```
- Set env vars in Vercel dashboard
- Enable Edge Runtime for feed route

### 5.2 Backend → Railway
```bash
railway init
railway up
```
- Connect Supabase Postgres via `DATABASE_URL`
- Add Redis for caching

### 5.3 Environment Variables
**Frontend (`apps/web/.env.local`)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_URL=https://api.eduspark.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

**Backend (`apps/api/.env`)**
```
DATABASE_URL=
REDIS_URL=
OPENAI_API_KEY=
CLOUDINARY_URL=
CLERK_SECRET_KEY=
```

---

## Phase 6 — Growth & Marketing Features

- **Referral system** — unique referral codes, bonus credits
- **Streak system** — daily learning streaks (Duolingo-style)
- **Leaderboard** — weekly top learners
- **Share cards** — auto-generated lesson completion cards (OG image API)
- **Waitlist page** — email capture with social proof before full launch

---

## Build Order (Recommended)
1. [ ] Scaffold monorepo + install deps
2. [ ] Build landing page (Vercel deploy immediately)
3. [ ] Backend: auth + user model + database
4. [ ] Backend: courses + lessons CRUD
5. [ ] Frontend: auth flow (Clerk)
6. [ ] Frontend: feed page (core UX)
7. [ ] Frontend: course detail + lesson player
8. [ ] Backend + Frontend: AI tutor integration
9. [ ] Backend: feed algorithm
10. [ ] Frontend: dashboard + progress
11. [ ] Instructor studio (course creation)
12. [ ] Full deploy (Vercel + Railway)
13. [ ] Growth features (streaks, referrals, leaderboard)
