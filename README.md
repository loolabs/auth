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

SERVER_PORT=3002<br />
DB_DATABASE_NAME=auth<br />
DB_USERNAME=loolabs<br />
DB_PASSWORD=loolabs<br />
DB_PORT=5432<br />
CACHE_PORT=6379<br />
CACHE_PASSWORD=km0dSTMWNNhBdFA4<br />
CACHE_URL=redis://cache<br />
DATABASE_URL=postgresql://loolabs:loolabs@db/auth<br />
IS_DATABASE_LOCAL=true<br />
BCRYPT_SALT_ROUNDS=10<br />
EXPRESS_SESSION_SECRET=hhJwJqzDza7EWRiO

## Documentation
- [Server architecture](server/ARCHITECTURE.md)
