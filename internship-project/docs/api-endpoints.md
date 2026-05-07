# API Endpoints

This file explains the current backend routes in very simple words.

## 1. Home Route

### URL

`GET /`

### What it does

This is the front door.

It just says:

"Backend is running."

## 2. Health Route

### URL

`GET /api/v1/health`

### What it does

This is a quick doctor check.

It helps us see if the server is alive.

## 3. Country Route

### URL

`GET /api/v1/country`

### What it does

Returns the country record.

Right now it returns India.

## 4. States Route

### URL

`GET /api/v1/states`

### What it does

Returns all sample states.

## 5. Districts Route

### URL

`GET /api/v1/districts?stateCode=27`

### What it does

Returns districts that belong to one state.

### Example

If `stateCode=27`, the route returns Maharashtra districts from sample data.

## 6. Sub-Districts Route

### URL

`GET /api/v1/sub-districts?districtCode=497`

### What it does

Returns sub-districts that belong to one district.

## 7. Villages Route

### URL

`GET /api/v1/villages`

### What it does

Returns all sample villages.

### Optional filters

- `stateCode`
- `districtCode`
- `subDistrictCode`

### Example

`GET /api/v1/villages?districtCode=497`

This means:

"Show me villages from district 497 only."

## 8. Village Search Route

### URL

`GET /api/v1/villages/search?name=mani`

### What it does

Searches villages by name.

The search is simple and beginner-friendly:

if the typed text appears inside the village name, it matches.

## 9. Village Detail Route

### URL

`GET /api/v1/villages/525002`

### What it does

Returns one village by code and also shows its full hierarchy:

- country
- state
- district
- sub-district
- village

This is useful because clients usually want both:

- the village itself
- the parent places above it
