# India Village Geo API

Production-style backend for serving India village-level geographical hierarchy data from the MDDS dataset.

## What Is Built

- Node.js + Express REST API
- Neon/PostgreSQL database with Prisma ORM
- Normalized geography schema:
  `Country -> State -> District -> SubDistrict -> Village`
- MDDS Excel/ODS import pipeline with validation, dedupe, batching, and reports
- API key + API secret authentication
- JWT user login and API key management
- Daily rate limiting with Redis/Upstash-ready storage and local fallback
- Cache-aware geography endpoints with Redis/Upstash-ready storage and local fallback
- Async API usage logging
- Admin usage analytics endpoint
- Paginated village search/list APIs
- Standardized address output

## Current Imported Data

```text
Countries: 1
States: 29
Districts: 530
Sub-districts: 5354
Villages: 564179
```

## Project Structure

```text
backend/   Express API, Prisma schema, import scripts
database/  database planning notes
docs/      architecture, dataset, and compliance documentation
frontend/  placeholder for future UI
```

## Quick Start

```bash
cd backend
npm install
copy .env.example .env
npx prisma db push
npm.cmd run dev
```

Server:

```text
http://localhost:3000
```

## Import MDDS Data

Dry run:

```bash
npm.cmd run import:mdds:dry
```

Write to database with larger batches:

```bash
npm.cmd run import:mdds -- --batch-size=10000
```

Check row counts:

```bash
npm.cmd run db:counts
```

## Demo Credentials

Create a demo API key and secret:

```bash
npm.cmd run seed:apikey
```

Create an admin user:

```bash
npm.cmd run seed:admin
```

## Example API Call

```bash
curl -H "x-api-key: YOUR_KEY" -H "x-api-secret: YOUR_SECRET" "http://localhost:3000/api/v1/villages/search?name=Manibeli&limit=5"
```

Sample response includes:

```text
Manibeli, Akkalkuwa, Nandurbar, MAHARASHTRA, India
```

## Submission Notes

- `.env` is intentionally ignored. Use `.env.example` for setup.
- `node_modules` is intentionally ignored. Install dependencies with `npm install`.
- See `docs/problem-statement-compliance.md` for the requirement-by-requirement checklist.