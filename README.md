# Candid Score

Candid Score is an internal candidate scoring and review dashboard built for the TechKraft Full-Stack Engineer take-home assignment. It focuses on the workflow described in the prompt: authenticated reviewers and admins, candidate filtering, structured scoring, and mock AI-assisted summaries.

## Overview

This repository contains:

- A FastAPI backend for authentication, candidate listing, candidate detail, scoring, summary generation, and score streaming
- A React + Vite frontend for login, candidate browsing, filtering, scoring, and candidate detail views
- Docker Compose setup for local development

## Tech Stack

- Backend: Python, FastAPI, SQLModel, PostgreSQL, JWT auth
- Frontend: React, Vite, React Router, TanStack Query
- Infra: Docker, Docker Compose

## Repository Structure

```text
.
├── README.md
├── assigment.md
├── compose.yml
├── compose.override.yml
├── compose.prod.yml
├── backend/
└── frontend/
```

## What Is Implemented

### Backend

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /candidates`
- `GET /candidates/{id}`
- `POST /candidates/{id}/scores`
- `POST /candidates/{id}/summary`
- `GET /candidates/{id}/stream`

### Frontend

- Login page
- Protected routes
- Candidate list page with filters and pagination
- Candidate detail page
- Score submission UI
- Summary generation UI with loading state

### Role-Based Access Control

- Registration hardcodes new users to the `reviewer` role
- Reviewers cannot see `internal_notes`
- Reviewers only receive their own scores on candidate detail and stream endpoints
- Admins can view all scores and internal notes

## Scope Notes

The core application flow is implemented and runnable in local development. A few assignment items are still incomplete or only partially finished:

- Backend tests are not implemented yet; `backend/tests/test_api.py` is currently empty
- The assignment asks for soft delete behavior, but there is no delete flow implemented yet
- `compose.prod.yml` is only a partial stub today
- The frontend production Docker stage still needs cleanup before relying on it for a real production image
- Demo data is loaded through an explicit seed command rather than automatic startup seeding
- Alembic migrations are wired for local development startup, but production migration orchestration is not finalized yet

## Local Setup

### Prerequisites

- Docker Desktop
- Docker Compose

### Environment

Create a local `.env` file from `.env.example`.

The root `.env` is the single local configuration file for this project. It contains backend settings and can also provide `VITE_API_URL` to the frontend development container.

Example values:

```env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=candidate-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
VITE_API_URL=http://localhost:8000

SECRET_KEY=change-me-to-a-random-hex-string
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

`SECRET_KEY` is required. The backend will refuse to start if it is missing, left as the example placeholder value, or shorter than 16 characters.

### Run With Docker Compose

Start the local development stack with:

```bash
docker compose up --build db be fe
```

The backend runs `alembic upgrade head` on startup before launching the FastAPI development server.

If you also want a database UI, include Adminer:

```bash
docker compose up --build db be fe adminer
```

Available services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Adminer: `http://localhost:8080`
- Postgres from host: `localhost:5433`

### Seed Demo Data

After the backend and database are running, seed the local environment with:

```bash
docker compose exec be uv run python -m app.seed
```

Run the seed after the backend container has started successfully so the database schema is already migrated.

The seed script is idempotent:

- It creates or updates the demo users
- It inserts demo candidates only when they do not already exist

Seeded credentials:

- Admin: `admin@yopmail.com` / `admin`
- Recruiter: `recruiter@yopmail.com` / `recruiter.`

The seed currently inserts 12 sample candidates.

## Example API Calls

### Register a Reviewer

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"reviewer@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=reviewer@example.com&password=secret123"
```

### List Candidates

Replace `<TOKEN>` with the JWT returned from the login response.

```bash
curl "http://localhost:8000/candidates?status=new&limit=20&offset=0" \
  -H "Authorization: Bearer <TOKEN>"
```

### Candidate Detail

```bash
curl http://localhost:8000/candidates/1 \
  -H "Authorization: Bearer <TOKEN>"
```

### Submit a Score

```bash
curl -X POST http://localhost:8000/candidates/1/scores \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"category":"communication","score":4,"note":"Clear and concise answers."}'
```

### Generate a Summary

```bash
curl -X POST http://localhost:8000/candidates/1/summary \
  -H "Authorization: Bearer <TOKEN>"
```

### Stream Scores (SSE)

```bash
curl -N http://localhost:8000/candidates/1/stream \
  -H "Authorization: Bearer <TOKEN>"
```

## Architecture Decision Record

### 1. FastAPI + SQLModel

Context: The assignment called for a Python backend with authenticated API endpoints, filtering, pagination, and role-aware responses, all within a short delivery window.

Decision: Use FastAPI for the API layer and SQLModel for typed models plus database access.

Trade-off: This choice keeps implementation fast and readable, but it also ties the project to SQLAlchemy and SQLModel conventions and may need refactoring if the query layer becomes more complex.

### 2. PostgreSQL With Normalized Tables

Context: The data model includes users, candidates, and many reviewer-created scores per candidate, along with filtering by status, role applied, and skill.

Decision: Store candidates and scores in separate relational tables, with indexed fields such as `status`, `role_applied`, and `candidate_id`.

Trade-off: This makes filtering and role-sensitive data access straightforward, but it adds schema and migration overhead compared with using a simpler embedded database.

### 3. Server-Enforced JWT Authorization

Context: The assignment explicitly requires reviewer/admin separation and forbids accepting role from the registration payload.

Decision: Issue JWTs after login, hardcode registration to `reviewer`, and enforce field and score visibility inside backend endpoints.

Trade-off: This keeps the trust boundary on the server, but it also means serialization logic must be handled carefully so admin-only data is never exposed accidentally.

## Debugging Signal

The bug in the provided snippet is that it loads the full `candidates` table into application memory first, then applies filtering and pagination in Python.

Why it matters:

- It does a full table scan on every request
- It wastes memory and CPU in the application process
- It prevents the database from using indexes for `status`, keyword filtering, and pagination efficiently
- Pagination becomes more expensive as the table grows because the app handles far more rows than it returns

Correct approach:

- Push filtering into SQL
- Apply `WHERE` conditions in the query
- Apply `LIMIT` and `OFFSET` in the database
- Add indexes for the fields used most often by search and filtering

Conceptually, the query should look like this:

```python
SELECT *
FROM candidates
WHERE status = :status
  AND (...keyword conditions...)
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset
```

## Learning Reflection

One area I would explore further is hardening the production path so the Docker and Compose setup are as complete as the local development workflow. I would also invest next in automated tests around reviewer versus admin visibility, since that is the most important trust boundary in the product.

## Notes

- Use `.env.example` as the template for local configuration
- Ports in this README match the current Docker Compose development setup
- Summary generation is intentionally a mocked async flow rather than a real LLM integration
