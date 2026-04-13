# EduSpark

AI-powered learning platform that delivers bite-sized courses in an Instagram-style feed.

## Features

- **Swipe to Learn**: Instagram-style feed with bite-sized video lessons
- **AI Personal Tutor**: Ask anything, get instant answers and explanations
- **Spaced Repetition**: AI remembers what you've learned and optimizes review timing
- **AI Quiz Generator**: Auto-generate practice questions from any lesson
- **Progress Tracking**: Visual progress indicators, streaks, and learning stats
- **Course Creation**: AI-assisted course generation for instructors

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TailwindCSS + shadcn/ui
- Framer Motion (animations)
- Clerk (authentication)
- Lucide React (icons)

### Backend
- FastAPI (Python)
- SQLAlchemy + asyncpg (PostgreSQL)
- Redis (caching + Celery broker)
- Celery (background tasks)
- OpenAI GPT-4o (AI features)
- Cloudinary (media storage)

### Infrastructure
- Vercel (frontend hosting)
- Railway/Render (backend hosting)
- Supabase (PostgreSQL)
- Upstash (Redis)

## Project Structure

```
eduspark/
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── src/app/      # Pages (App Router)
│   │   ├── src/components/ui/  # UI components
│   │   └── package.json
│   └── api/              # FastAPI backend
│       ├── core/         # Config, DB, security
│       ├── models/       # SQLAlchemy models
│       ├── routers/      # API endpoints
│       ├── schemas/      # Pydantic schemas
│       └── requirements.txt
├── .windsurf/workflows/  # Build workflow
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Redis

### Frontend Setup

```bash
cd apps/web
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Clerk keys

npm run dev
```

### Backend Setup

```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/feed` | Personalized lesson feed |
| GET | `/api/v1/courses` | List all courses |
| POST | `/api/v1/courses` | Create course (instructor) |
| GET | `/api/v1/courses/{id}` | Get course details |
| POST | `/api/v1/enrollments` | Enroll in course |
| POST | `/api/v1/ai/ask` | AI tutor Q&A |
| POST | `/api/v1/ai/generate-quiz` | Generate quiz |
| POST | `/api/v1/ai/summarize` | Summarize lesson |
| GET | `/api/v1/users/me` | Get user profile |

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel --prod
```

### Backend (Railway)

```bash
cd apps/api
railway login
railway init
railway up
```

## Environment Variables

### Frontend
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `CLERK_SECRET_KEY` - Clerk secret for verification
- `OPENAI_API_KEY` - OpenAI API key
- `CLOUDINARY_*` - Cloudinary credentials

## Marketing Psychology Applied

- **Violet (#7C3AED)**: Trust, intelligence, creativity
- **Amber (#F59E0B)**: Urgency, CTAs, highlights
- **FOMO Triggers**: "X users signed up this week"
- **Social Proof**: Stats, testimonials, live counters
- **Zeigarnik Effect**: Incomplete progress bars drive completion
- **Dual CTA Strategy**: Primary + secondary actions

## License

MIT
