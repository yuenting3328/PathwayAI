# PathwayAI Backend

Fastify 5 + Prisma 6 + PostgreSQL 16 backend serving both frontend apps.

## Prerequisites

- Node.js 22+
- PostgreSQL 16 running locally
- pnpm (or npm)

## Setup

```bash
cd backend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
# Edit .env — set DATABASE_URL to your Postgres instance

# Run database migrations
pnpm db:migrate

# Seed with demo data
pnpm db:seed

# Start dev server
pnpm dev
```

The server runs on `http://localhost:4000`.

## Demo accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Graduate | student@cuhk.edu.hk | student123 |
| Institution Admin | admin@cuhk.edu.hk | admin123456 |

## API

All routes are prefixed `/api/v1`. Protected routes require `Authorization: Bearer <token>`.

| Group | Prefix |
|-------|--------|
| Auth | `/api/v1/auth` |
| Jobs | `/api/v1/jobs` |
| Applications | `/api/v1/applications` |
| Skills | `/api/v1/skills` |
| Credentials | `/api/v1/credentials` |
| Coaching | `/api/v1/coach` |
| Programmes | `/api/v1/programmes` |
| Analytics | `/api/v1/analytics` |
| Market | `/api/v1/market` |
| Institution | `/api/v1/institution` |
| Employers | `/api/v1/employers` |

Health check: `GET /health`

## Running the frontends

```bash
# PathwayAI App (port 5173)
cd "PathwayAI App" && pnpm install && pnpm dev

# PathwayAI Institutional Platform (port 5174)
cd "PathwayAI Institutional Platform" && pnpm install && pnpm dev
```

Both frontends read `VITE_API_URL` from their `.env` file (default: `http://localhost:4000/api/v1`).
