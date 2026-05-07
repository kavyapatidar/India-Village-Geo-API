# Backend Step 3: Turning The Starter Into A Small Real API

This step makes the backend feel more like a real internship submission.

Before this step, the backend only had:

- home route
- health route
- one states route

That was a nice start, but the internship project needs more shape.

So now the backend has:

- country route
- states route
- districts route
- sub-districts route
- villages route
- village search route
- village detail route
- reusable service logic
- reusable response helper
- not found route handling

## Big Idea In Baby Words

Instead of putting every little thing directly inside route files, I separated the jobs.

Think of it like a small restaurant:

- `routes` = waiter taking the order
- `services` = cook preparing the food
- `data` = ingredients shelf
- `utils` = small helper tools

This is a very important project habit.

Each file should do one clear job.

## New Files Added

### `backend/src/data/geoData.js`

This file stores sample hierarchy data.

It contains:

- country
- states
- districts
- sub-districts
- villages

This is still practice data, but now it matches the hierarchy much better.

## Why This File Matters

If I keep data inside route files, the route files become messy.

So I moved the data into one separate file.

That makes the route files smaller and easier to read.

### `backend/src/services/geoService.js`

This file contains the backend logic.

This is where the app asks questions like:

- give me all states
- give me districts of one state
- give me villages using filters
- search village by name
- get one village with full hierarchy

## Why A Service File Is Helpful

Route files should not become giant thinking files.

The route should mostly do this:

1. receive request
2. call helper logic
3. send response

So the "thinking work" moves into the service file.

That is exactly what `geoService.js` does.

### `backend/src/utils/responseHelpers.js`

This file has tiny helper functions for sending responses.

It helps keep the API responses neat and similar.

Instead of repeating the same JSON shape again and again, I made a helper for it.

### `backend/src/routes/geoRoutes.js`

This file is the main geography route file now.

It handles:

- `/api/v1/country`
- `/api/v1/states`
- `/api/v1/districts`
- `/api/v1/sub-districts`
- `/api/v1/villages`
- `/api/v1/villages/search`
- `/api/v1/villages/:code`

## Query Parameters In Very Easy Words

You will see URLs like:

`/api/v1/districts?stateCode=27`

The part after `?` is called a query parameter.

That is just a small extra instruction sent in the URL.

So this one means:

"Give me districts where state code is 27."

## Path Parameter In Very Easy Words

You will also see:

`/api/v1/villages/:code`

The `:code` part is a placeholder.

That means the real URL can be something like:

`/api/v1/villages/525002`

So the route says:

"I am waiting for one village code here."

## Filtering In Very Easy Words

In the villages route, I made optional filters.

That means:

- if no filter is given, return all villages
- if one filter is given, return matching villages only

Example:

`/api/v1/villages?districtCode=497`

This means:

"Only show villages from district 497."

## Search In Very Easy Words

The search route uses this idea:

if the typed word is found inside the village name, return that village.

So:

`mani`

can match:

`Manibeli`

This is a simple starter search. Later, database search can become faster and smarter.

## 404 Route In Very Easy Words

At the end of `app.js`, I added a fallback route.

That means:

if the user asks for a route that does not exist, the server sends:

"Route not found"

This is good because it feels more complete and professional.

## Why This Step Is Good For Submission

This step shows the company that the project is not just one toy file.

It now shows:

- route organization
- data separation
- reusable logic
- filtering
- search
- detail endpoint
- clean JSON responses

That is a much nicer internship-level foundation.

## What Still Comes Later In A Real Full Product

This is still a starter backend, not the final production platform.

Later, the next serious steps would be:

1. replace sample data with database data
2. import real Excel data
3. add Prisma schema
4. connect PostgreSQL
5. add API key authentication
6. add rate limiting
7. add logging
8. deploy

But for now, this step is exactly the right kind of growth:

small enough to understand, but strong enough to look like real project work.
