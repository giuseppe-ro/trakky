> [!IMPORTANT]  
> Still under development. Some weirdness is to be expected :)

# Trakky

A personal, self-hosted, simple expenses tracker.
Demo [here](https://trakky.pages.dev).

## How to run with docker

> [!NOTE]  
> At the moment, this requires mariadb to be configured. See [docs](https://mariadb.org/documentation/) to see how to install it.
> As the backend of this app is set with Prisma, you can use any prisma supported database. See prisma [docs](https://www.prisma.io/docs/getting-started/quickstart) for more info.

Set the db:
Create a db named "expenses", and a user with full permission to that database.
```bash
cd trakky-server
export DATABASE_URL="mysql://USERNAME:PASSWORD@URL:PORT/expenses?schema=public"
npm install
npx prisma migrate dev --name init
```
This will initialise the database and create the necessary tables.

Set and run the backend:
```bash
cd trakky-server
docker build -t trakky-server .
docker run -p 8999:8999 -e DATABASE_URL="mysql://USERNAME:PASSWORD@URL:PORT/expenses?schema=public" --name trakky-server -d trakky-server
```

Set and run the frontent:
```bash
cd trakky-client
docker build -t trakky-client .
docker run -p 8998:8998 --name trakky -d trakky-client
```
