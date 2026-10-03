> [!IMPORTANT]  
> Still under development. Some weirdness is to be expected :)

# Trakky

A personal, self-hosted, simple expenses tracker. Supports optional OpenId authentication.

Demo [here](https://trakky.pages.dev).


## How to run with docker

> [!NOTE]  
> At the moment, this requires mariadb to be configured. See [docs](https://mariadb.org/documentation/) to see how to install it.
> As the backend of this app is set with Prisma, you can use any prisma supported database. See prisma [docs](https://www.prisma.io/docs/getting-started/quickstart) for more info.

### Set the db:
Create a db named "expenses", and a user with full permission to that database.
```bash
cd trakky-server
export DATABASE_URL="mysql://USERNAME:PASSWORD@URL:PORT/expenses?schema=public"
npm install
npx prisma migrate dev --name init
```
This will initialise the database and create the necessary tables.

### Create a docker network:
```bash
docker network create trakky
```

### Set and run the backend:
```bash
docker build -t trakky-server ./trakky-server

docker run -p 8999:8999 --network trakky -e SKIP_AUTH=true -e DATABASE_URL="mysql://USERNAME:PASSWORD@URL:PORT/expenses?schema=public" -e ALLOWED_ORIGINS="http://localhost,http://other-origin.com" --name trakky-server -d trakky-server 
```
> [!NOTE]  
> If you have an authentication server (e.g. Authentik) which supports OAUTH and want to add authentication: 
> ```bash
> -e AUTH_ISSUER=https://authentik.example.com/application/o/trakky/
> ``` 
> `AUTH_ISSUER` must be exactly the issuer Authentik reports. Set `AUTH_USERINFO_URL` instead to skip discovery, and `AUTH_CACHE_TTL_MS` to change how long a verified token is trusted (default 60s).

### Set and run the frontend:
```bash
docker build --build-arg SKIP_AUTH=true --build-arg SERVER_URL=trakky-server-url -t trakky-client ./trakky-client

docker run -p 8997:80 --network trakky --name trakky -d trakky-client
```

> [!NOTE]  
> if you have an authentication server (e.g. Authentik) which supports OAUTH and want to add authentication: 
> ```bash 
> --build-arg OPENID_AUTH_CLIENT_ID=oauth_provider_client_id --build-arg OPENID_AUTH_AUTHORITY=https://authentik.example.com/application/o/trakky/ --build-arg SKIP_AUTH=false
> ```
> `OPENID_AUTH_AUTHORITY` must be exactly the issuer Authentik reports. Register these redirect URIs in the Authentik application, character for character: `http://localhost:8997/`, `http://localhost:8997/silent-refresh.html` and `http://localhost:8997` (post-logout).

> [!NOTE]  
> for a demo instance (fake data, no authentication): add `--build-arg DEMO_MODE=true`. Demo mode implies `SKIP_AUTH=true`.
