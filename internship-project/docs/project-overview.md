# Project Overview

## 1. What Is This Project?

This project is a software platform that gives geographical data of India using APIs.

The platform is mainly for business clients who need clean and structured address data. Instead of storing all this data on their side, they can call our API and get the result.

## 2. Main Problem

Many businesses have issues like:

- address data is not standardized
- local databases become old
- managing village data is difficult
- search and dropdown systems become slow when data is large

## 3. Proposed Solution

We will build a centralized API platform that stores geographical data in a proper hierarchy:

`Country -> State -> District -> Sub-District -> Village`

The API will return structured address values that can be used in forms and dashboards.

## 4. Expected Features

- Search village by name
- Filter by state, district, and sub-district
- API key based access
- Usage tracking
- Admin controls
- Rate limiting for safety

## 5. Tech Stack From The Given Instructions

- Backend: Node.js + Express.js
- Database: PostgreSQL using NeonDB
- ORM: Prisma
- Frontend: React + Vite
- Cache: Redis / Upstash
- Auth: JWT + bcrypt
- Deployment: Vercel

## 6. My Understanding

At first, I thought this was only a normal API project, but it is more like a SaaS product because it also includes users, API keys, rate limits, usage logs, and probably subscription plans later.
