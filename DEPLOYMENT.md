# Deployment Guide - EduSpark

## Security Overview

**IMPORTANT**: This project uses environment variables for sensitive configuration. All API keys and secrets are stored in `.env` files which are **gitignored** and never committed to the repository.

### Security Measures Implemented

1. **.gitignore** - Prevents `.env` files from being committed
2. **.env.example** - Template files showing required variables (safe to commit)
3. **GitHub Secrets** - Recommended for production deployment
4. **Clerk JWKS URL** - Configured for token verification: `https://decent-lynx-77.clerk.accounts.dev/.well-known/jwks.json`

---

## Clerk Configuration

Your Clerk instance is configured at: `https://decent-lynx-77.clerk.accounts.dev`

### Required Clerk Keys

Get these from [Clerk Dashboard](https://dashboard.clerk.com/):

1. **Frontend Publishable Key** (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
2. **Backend Secret Key** (`CLERK_SECRET_KEY`)

### JWKS URL

Already configured in backend:
```
https://decent-lynx-77.clerk.accounts.dev/.well-known/jwks.json
```

---

## Local Development Setup

### Frontend (Next.js)

1. Copy the example file:
```bash
cd apps/web
cp .env.example .env.local
```

2. Edit `.env.local` with your keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Install and run:
```bash
npm install
npm run dev
```

### Backend (FastAPI)

1. Copy the example file:
```bash
cd apps/api
cp .env.example .env
```

2. Edit `.env` with your keys:
```env
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_JWKS_URL=https://decent-lynx-77.clerk.accounts.dev/.well-known/jwks.json
DATABASE_URL=postgresql://user:password@localhost:5432/eduspark
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-your-openai-key
```

3. Activate virtual environment and install:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload
```

---

## Production Deployment

### GitHub Secrets Setup

For production deployment, use GitHub Secrets instead of `.env` files.

#### Frontend Secrets (Vercel)

1. Go to your Vercel project settings
2. Add these environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - `/feed`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - `/feed`
   - `NEXT_PUBLIC_API_URL` - Your production API URL (e.g., `https://api.eduspark.com/api/v1`)

#### Backend Secrets (Railway/Render)

Add these environment variables in your hosting platform:

```
CLERK_SECRET_KEY=sk_live_your_secret_key
CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_JWKS_URL=https://decent-lynx-77.clerk.accounts.dev/.well-known/jwks.json
DATABASE_URL=your_production_database_url
REDIS_URL=your_production_redis_url
OPENAI_API_KEY=sk_live_your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Deploying to Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. Add environment variables (see above)
4. Deploy

---

## Deploying to Railway (Backend)

1. Connect your GitHub repository to Railway
2. Configure build settings:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables (see above)
4. Deploy

---

## Security Best Practices

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Use different keys for development and production**
3. **Rotate keys regularly** - Especially if they're compromised
4. **Use GitHub Actions Secrets** for CI/CD pipelines
5. **Enable 2FA** on your Clerk account
6. **Monitor API usage** in Clerk and OpenAI dashboards

---

## Troubleshooting

### Clerk Authentication Issues

1. Verify JWKS URL is correct: `https://decent-lynx-77.clerk.accounts.dev/.well-known/jwks.json`
2. Check that your Clerk instance is active
3. Ensure keys match your Clerk dashboard

### Database Connection Issues

1. Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
2. Check database is running and accessible
3. Ensure firewall allows connection

### CORS Issues

1. Update `CORS_ORIGINS` in backend config
2. Include your frontend URL in the allowed origins

---

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/reference/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
