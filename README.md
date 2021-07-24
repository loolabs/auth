# Auth

## Quick Start

1. install Node v15, Docker, Docker Compose
1. clone this repository
1. run `npm install`
1. run `docker-compose up` to start server and db
1. `cd` into `client`
1. run `npm install`
1. run `npm run dev` to start client

## Sample Environment Variables

SERVER_PORT=3002
DB_DATABASE_NAME=auth
DB_USERNAME=loolabs
DB_PASSWORD=loolabs
DB_PORT=5432
CACHE_PORT=6379
CACHE_PASSWORD=km0dSTMWNNhBdFA4
CACHE_URL=redis://cache
DATABASE_URL=postgresql://loolabs:loolabs@db/auth
IS_DATABASE_LOCAL=true
BCRYPT_SALT_ROUNDS=10
EXPRESS_SESSION_SECRET=hhJwJqzDza7EWRiO

## Documentation
- [Server architecture](server/ARCHITECTURE.md)
