# Architecture Notes

## High Level Flow

Client sends request -> API layer receives request -> authentication checks happen -> rate limit checks happen -> request goes to handler -> data is read from database/cache -> response is sent back

## Layers

### Client Layer

- Admin panel
- B2B client app
- Demo or public form

### API Layer

- Receives requests
- Validates headers
- Checks API key
- Applies rate limiting

### Backend Layer

- Route handlers
- Business logic
- Database queries
- Logging

### Data Layer

- PostgreSQL for main data
- Redis for caching and rate limit counters

## Beginner Note

I am keeping the architecture simple in the beginning. In future, this can become more modular with services, repositories, and better logging.
