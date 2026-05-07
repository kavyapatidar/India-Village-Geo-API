# Database Notes

## Main Tables I Will Probably Need

- Country
- State
- District
- SubDistrict
- Village
- User
- ApiKey
- ApiLog

## Basic Relationships

- One country has many states
- One state has many districts
- One district has many sub-districts
- One sub-district has many villages
- One user can have many API keys

## Important Idea

The hierarchy should be preserved properly, because a village should always belong to the correct sub-district, district, and state.

## My Current Assumption

The MDDS dataset gives codes for each level, so those codes should also be stored and not ignored.

## Current Import Status

The backend now has:

- Prisma schema for `Country`, `State`, `District`, `SubDistrict`, `Village`, `User`, `ApiKey`, and `ApiLog`
- MDDS import script at `backend/scripts/importMdds.js`
- Raw MDDS files under `backend/data/raw/mdds-master.xlsx/dataset`
- Geography service methods reading from Prisma instead of sample arrays

Safe dry-run result:

- Dataset files found: `30`
- Total rows read: `570435`
- Usable village rows: `564397`
- Skipped rows: `6038`

Next database steps:

1. Make sure PostgreSQL is running.
2. Put the real connection string in `backend/.env` as `DATABASE_URL`.
3. From `backend/`, run `npx prisma db push` to create tables.
4. Run `npm.cmd run import:mdds:dry` once more.
5. Run `npm.cmd run import:mdds` to write the MDDS data.
6. Run `npm.cmd run seed:apikey` to create a test API key.
