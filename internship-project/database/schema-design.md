# Initial Schema Design

This is my first simple version of the schema design.

## Country

- `id`
- `name`
- `code`
- `createdAt`

## State

- `id`
- `countryId`
- `stateCode`
- `name`
- `createdAt`

## District

- `id`
- `stateId`
- `districtCode`
- `name`
- `createdAt`

## SubDistrict

- `id`
- `districtId`
- `subDistrictCode`
- `name`
- `createdAt`

## Village

- `id`
- `subDistrictId`
- `villageCode`
- `name`
- `createdAt`

## User

- `id`
- `name`
- `email`
- `passwordHash`
- `role`

## ApiKey

- `id`
- `userId`
- `key`
- `secretHash`
- `status`

## ApiLog

- `id`
- `apiKeyId`
- `endpoint`
- `responseTime`
- `createdAt`
