India Village Geo API
A production-ready backend service for serving India's village-level geographical hierarchy data from the MDDS dataset. This API provides structured, standardized address data in a normalized hierarchy: Country → State → District → Sub-District → Village, addressing challenges like outdated databases and slow searches for businesses.

Features

RESTful API Endpoints: Comprehensive routes for countries, states, districts, sub-districts, and villages.
Authentication & Security: API key + secret validation, JWT user login, rate limiting with Redis/Upstash support, and async usage logging.
Search & Filtering: Paginated village searches by name or hierarchy filters (state, district, sub-district).
Data Hierarchy: Returns full parent hierarchies for detailed village queries.
Admin Analytics: Usage tracking and summary endpoints for monitoring.
Caching: Redis/Upstash-ready for performance optimization.
Data Coverage: 1 country (India), 29 states, 530 districts, 5,354 sub-districts, and 564,179 villages.
Import Pipeline: MDDS Excel/ODS data import with validation, deduplication, batching, and reporting.

Tech Stack

Backend: Node.js, Express.js
Database: PostgreSQL (NeonDB), Prisma ORM
Authentication: JWT, bcrypt
Caching: Redis / Upstash
Deployment: Vercel-ready
Frontend Placeholder: React + Vite (future admin/client dashboards)

Usage
API Endpoints Overview
GET / - Home route: Confirms backend is running.
GET /api/v1/health - Health check.
GET /api/v1/country - Returns the country (India).
GET /api/v1/states - Lists all states.
GET /api/v1/districts?stateCode=27 - Districts for a state (e.g., Maharashtra).
GET /api/v1/sub-districts?districtCode=497 - Sub-districts for a district.
GET /api/v1/villages - All villages (with optional filters: stateCode, districtCode, subDistrictCode).
GET /api/v1/villages/search?name=mani - Search villages by name.
GET /api/v1/villages/525002 - Detailed village with full hierarchy.
Authentication routes: /api/v1/auth/register, /api/v1/auth/login, etc.
Admin: /api/v1/admin/usage-summary.

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature/your-feature.
Commit changes: git commit -m 'Add your feature'.
Push to the branch: git push origin feature/your-feature.
Open a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments

Data sourced from MDDS dataset.
Built as part of an internship project to demonstrate SaaS potential for geographical data services.
