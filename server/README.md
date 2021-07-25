# Auth Server

Loo Lab's centralized auth microservice, used to authenticate common apps and services

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. [Docker](https://www.docker.com/products/docker-desktop)
1. `.env` in the root directory of the monorepo

```
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
```

### Installing

1. Clone the `auth` repository.
1. In the root directory of `auth`, run `docker-compose up` to start the express and postgres servers.

You should see messages in your terminal from the `server` and `postgres` containers, and finally be greeted with:

![](./assets/server-prompt.png)

## Tests

We separate our tests into two categories. To run integration tests locally, you must have the entire server running in the background (for now). This might change in the future.

Unit tests: `npm run test:unit`

Integration tests: `npm run test:integration`

## Migrations

Here is how to make a [migration](https://en.wikipedia.org/wiki/Schema_migration) to our database schemas.

1. Make the change to the MikroORM entity of choice. Entities are located in `src/shared/infra/db/entities`.
1. Run `docker container ls`. Find the container id for the server container.
1. Run `docker exec -it <CONTAINER_ID> sh`.
1. Run `npm run migration:create`.
1. A migration file should now be created in `src/migrations`.

## Built With

- [Typescript](https://www.typescriptlang.org/) - Language
- [Express](https://expressjs.com/) - HTTP Server
- [MikroORM](https://mikro-orm.io/) - ORM
- [Postgres](https://www.postgresql.org/) - Database

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the [LICENSE.md](../LICENSE.md) file for details
