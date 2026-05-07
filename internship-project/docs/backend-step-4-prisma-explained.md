# Backend Step 4: First Real Database Schema

This is the first step where the project starts looking less like a demo and more like a real product plan.

Before this step, the backend only had:

- sample route files
- sample data in JavaScript
- helper functions

That was useful for learning API flow.

But a real SaaS project cannot depend on fake data inside code files.

So now I added the first database schema using Prisma.

## What Is Prisma In Very Easy Words

Prisma is a tool that helps the backend talk to the database in a clean way.

Think of it like this:

- PostgreSQL = the big cupboard where data is stored
- Prisma = the helper that knows how to open the cupboard properly

Instead of writing everything by hand in raw SQL from the beginning, Prisma gives us a cleaner structure.

## What Is `schema.prisma`

The file:

`backend/prisma/schema.prisma`

is the blueprint of the database.

A blueprint means a building plan.

Before building a house, you make a plan for:

- rooms
- doors
- walls
- connections

Same here.

Before building the real database, we define:

- tables
- columns
- relationships

## The First 2 Blocks

```prisma
generator client {
  provider = "prisma-client-js"
}
```

This means:

Prisma should generate JavaScript tools for our Node.js backend.

Now this:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This means:

- the database type is PostgreSQL
- the connection string will come from an environment variable called `DATABASE_URL`

## What Is An Environment Variable

This is just a value stored outside the code.

Why do we do that?

Because passwords and database links should not be hardcoded directly into code files.

So I also added:

`backend/.env.example`

This file shows the shape of the database connection string.

## Main Geography Tables

I added these models:

- `Country`
- `State`
- `District`
- `SubDistrict`
- `Village`

These match the real hierarchy we already learned.

## Very Easy Meaning Of A Model

In Prisma, a `model` is basically a table.

So:

```prisma
model State {
  ...
}
```

means:

"Make a table called State."

## Example: Country Model

```prisma
model Country {
  id        Int      @id @default(autoincrement())
  name      String
  code      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  states State[]
}
```

Easy meaning:

- `id` = unique number for each country row
- `name` = country name
- `code` = country code like `IND`
- `createdAt` = when row was created
- `updatedAt` = when row was last updated
- `states State[]` = one country can have many states

## Easy Meaning Of These Special Words

- `@id` = this is the main unique identity field
- `@default(autoincrement())` = database will automatically give 1, 2, 3, 4...
- `@unique` = this value cannot repeat
- `@default(now())` = use current time automatically
- `@updatedAt` = update the time automatically when the row changes

## Relationships In Baby Words

Example:

- one country has many states
- one state has many districts
- one district has many sub-districts
- one sub-district has many villages

This is exactly how the tables are connected.

So the database matches the real geography family tree.

## Why `countryId`, `stateId`, `districtId`, `subDistrictId` Exist

These are connection fields.

For example:

in the `State` table:

- `countryId` tells us which country this state belongs to

in the `District` table:

- `stateId` tells us which state this district belongs to

This is how the hierarchy stays correct.

## Why Codes Are Still Stored

We are not only storing names.

We are also storing:

- `stateCode`
- `districtCode`
- `subDistrictCode`
- `villageCode`

Why?

Because these codes come from the dataset and are important identifiers.

The company will care about this.

Names can sometimes look similar.

Codes are safer for matching and importing.

## Why I Added User, ApiKey, and ApiLog

Because this project is not only a geography database.

It is supposed to become a SaaS/API platform.

That means we also need product tables like:

- `User`
- `ApiKey`
- `ApiLog`

These support:

- clients
- API access
- request tracking

So these tables are part of the SaaS side of the project.

## What Is A Unique Rule Like `@@unique([stateId, districtCode])`

This means:

inside one state, the same district code should not repeat.

This is stronger than only checking the district code by itself.

It tells the database:

"Do not allow duplicate district code for the same parent."

Same idea is used for:

- sub-district inside district
- village inside sub-district

## Why This Step Matters A Lot

This step is important because now the project has:

- API structure
- route organization
- service logic
- first real database blueprint

So the project is moving from:

"practice backend"

toward:

"real product foundation"

## Honest Note

The schema is ready as a first version, but it is not connected yet to a real running PostgreSQL database.

That connection comes in the next serious steps.

For now, this step gives us the correct shape.
