# GigFlow — Smart Leads Dashboard

## 🚀 Live Demo

| | Link |
|--|--|
| **Frontend** | [gigflow-psi-two.vercel.app](https://gigflow-psi-two.vercel.app) |
| **Backend API** | [your-backend.onrender.com/api/health](https://your-backend.onrender.com/api/health) |
| **Demo Admin** | demo.admin@gigflow.com / Demo123! |
| **Demo Sales** | demo.sales@gigflow.com / Demo123! |

> Replace `your-backend.onrender.com` with the actual Render URL once deployed.

GigFlow is a full-stack SaaS-style lead operations dashboard for sales teams. It centralizes lead intake, filtering, role-based access, and CSV exports behind a secure JWT-authenticated API and a responsive React interface.

**Repository:** [https://github.com/Shaurya000-png/GigFlow-Smart-Leads-Dashboard](https://github.com/Shaurya000-png/GigFlow-Smart-Leads-Dashboard)

---

## Production Features

- JWT authentication with protected routes and persisted sessions
- Role-based access control (Admin vs Sales)
- Lead CRUD with validation (Zod on API, React Hook Form + Zod on UI)
- Debounced multi-filter search (status, source, text, sort)
- Server-side pagination
- Admin CSV export of filtered leads
- Structured JSON logging and request IDs
- Rate limiting on authentication endpoints
- Health checks for uptime monitoring (`GET /api/health`)
- Docker Compose stack with container healthchecks
- GitHub Actions CI for backend and frontend
- Automated test suites (Jest + Supertest, Vitest + Testing Library)

---

## Architecture Overview

```text
┌─────────────┐     HTTPS/REST      ┌──────────────────┐     Mongoose     ┌─────────────┐
│  React SPA  │ ◄──────────────────►│  Express API     │ ◄──────────────► │  MongoDB    │
│  (Vite)     │   /api/auth, leads  │  (Node/TS)       │                  │  Atlas/local│
└─────────────┘                     └──────────────────┘                  └─────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| **Frontend** | Auth UI, dashboard, filters, modals, React Query data fetching |
| **Backend** | REST API, RBAC, validation, error handling, export |
| **Database** | Users + leads collections with indexes on filter fields |

See **[DEMO.md](./DEMO.md)** for demo credentials and a quick walkthrough.

---

## Tech Stack

| Area | Technologies |
|------|----------------|
| Backend | Node.js, Express, TypeScript, Mongoose, JWT, Zod, Helmet |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, Zustand |
| Database | MongoDB (local, Docker, or MongoDB Atlas) |
| DevOps | Docker Compose, GitHub Actions, Vercel (frontend), Render (backend) |

---

## Folder Structure

```text
GigFlow-Smart-Leads-Dashboard/
├── backend/                 # Express API
│   ├── src/
│   │   ├── app.ts           # Express app factory (testable)
│   │   ├── server.ts        # Production entry
│   │   ├── config/          # Env + DB
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── validators/      # Zod schemas
│   │   └── __tests__/       # Jest + Supertest
│   └── .env.example
├── frontend/                # React SPA
│   ├── src/
│   └── .env.example
├── datasets/                # Demo seed JSON
├── .github/workflows/       # CI pipelines
├── docker-compose.yml
├── render.yaml              # Backend deploy blueprint
└── COMMIT_PLAN.md           # Suggested git history
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- MongoDB (local install or Docker)
- npm

### 1. Clone

```bash
git clone https://github.com/Shaurya000-png/GigFlow-Smart-Leads-Dashboard.git
cd GigFlow-Smart-Leads-Dashboard
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET (min 16 chars)
npm run seed
npm run dev
```

API runs at **http://localhost:5000**

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

App runs at **http://localhost:5173**

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `demo.admin@gigflow.com` | `Demo123!` |
| Sales | `demo.sales@gigflow.com` | `Demo123!` |

---

## Docker Setup

From the repository root (ensure `backend/.env` exists with `JWT_SECRET`):

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend | http://localhost:5000 |
| MongoDB | localhost:27017 |

Healthchecks are configured for `mongo`, `backend`, and `frontend`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | No | `development` \| `production` \| `test` |
| `MONGODB_URI` | Yes | Mongo connection string (Atlas or local) |
| `JWT_SECRET` | Yes | Signing secret (min 16 characters) |
| `JWT_EXPIRES_IN` | No | Token TTL (default `7d`) |
| `FRONTEND_URL` | No | Primary CORS origin for local dev |
| `CORS_ORIGINS` | No | Comma-separated production origins |
| `ALLOW_ADMIN_REGISTER` | No | `true` to allow public admin signup (default `false`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | API base URL including `/api` suffix |

**Example (production):**

```env
VITE_API_URL=https://your-api.onrender.com/api
```

---

## API Documentation

Base URL: `http://localhost:5000/api` (local)

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Uptime + DB status |

**Response:**

```json
{
  "status": "ok",
  "uptime": 120,
  "timestamp": "2026-05-22T12:00:00.000Z",
  "database": "connected"
}
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register (sales by default) |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Current user profile |

### Leads

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/leads` | Yes | Any | List with filters + pagination |
| POST | `/leads` | Yes | Any | Create lead |
| GET | `/leads/:id` | Yes | Any | Get one lead |
| PUT | `/leads/:id` | Yes | Any | Update lead (sales: own only) |
| DELETE | `/leads/:id` | Yes | Admin | Delete lead |
| GET | `/leads/export/csv` | Yes | Admin | Export filtered CSV |

### Query parameters (`GET /leads`)

| Param | Example | Description |
|-------|---------|-------------|
| `status` | `Qualified` | Filter by status (`All` ignored) |
| `source` | `Instagram` | Filter by source |
| `search` | `rahul` | Case-insensitive name/email search |
| `sort` | `latest` \| `oldest` | Sort by `createdAt` |
| `page` | `2` | Page number (default `1`) |
| `limit` | `10` | Page size (default `10`, max `100`) |

---

## Role-Based Access Control

| Capability | Admin | Sales |
|------------|:-----:|:-----:|
| View all leads | Yes | Own leads only |
| Create lead | Yes | Yes |
| Edit lead | Yes | Own leads only |
| Delete lead | Yes | No |
| Export CSV | Yes | No |

---

## Pagination & Filtering

- Filters are applied server-side for consistent results at scale.
- Pagination metadata is returned on every list response:

```json
{
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

- Frontend search input is debounced (500ms) to reduce API load.

---

## Testing

### Backend

```bash
cd backend
npm test
npm run typecheck
npm run build
```

Covers auth, leads, RBAC, filters, pagination helpers, and health checks using in-memory MongoDB.

### Frontend

```bash
cd frontend
npm test
npm run typecheck
npm run build
```

Covers login validation, lead table rendering, filters, and protected route behavior.

---

## CI/CD

GitHub Actions workflows run on pushes and PRs to `main`:

| Workflow | Path | Steps |
|----------|------|-------|
| **Backend CI** | `.github/workflows/backend-ci.yml` | install → typecheck → test → build |
| **Frontend CI** | `.github/workflows/frontend-ci.yml` | install → typecheck → test → build |

Both use Node.js 20 LTS with npm caching.

---

## Deployment

> The frontend is live at https://gigflow-psi-two.vercel.app

### Frontend — Vercel

1. Import the GitHub repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable:

   ```env
   VITE_API_URL=https://<your-backend-host>/api
   ```

`vercel.json` includes SPA rewrite rules.

### Backend — Render (or Railway)

1. Create a **Web Service** from the repo (use `render.yaml` as reference).
2. Set **Root Directory** to `backend`.
3. Build: `npm ci && npm run build`
4. Start: `npm run start`
5. Configure environment variables (see backend table above).
6. Use **MongoDB Atlas** for `MONGODB_URI`.
7. Set `CORS_ORIGINS` to your Vercel URL(s).

Health check path: `/api/health`

### MongoDB Atlas

1. Create a free cluster.
2. Add a database user and network access (`0.0.0.0/0` for cloud APIs).
3. Copy the connection string into `MONGODB_URI`.

---

## Security Features

- Password hashing with bcrypt
- JWT verification on protected routes
- Helmet security headers
- Auth rate limiting (30 requests / 15 min per IP)
- Zod request validation
- Admin role blocked on public registration by default
- Lead updates restricted to safe fields (no `createdBy` overwrite)
- Secrets only via environment variables (never committed)

---

## Scalability Considerations

- Stateless API suitable for horizontal scaling behind a load balancer
- MongoDB indexes on `status`, `source`, and `createdBy`
- Pagination caps (`limit` max 100) to protect the database
- Filter/query logic centralized in `buildLeadQuery` for maintainability
- Frontend data layer decoupled via React Query (easy cache tuning)
- Docker healthchecks and `/api/health` ready for orchestrators (Render, Railway, K8s)

---

## Scripts Reference

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run production build |
| `npm run seed` | Load demo users + leads |
| `npm test` | Run test suite |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Vitest test run |

---

## License

This project is provided for portfolio and internship demonstration purposes.
