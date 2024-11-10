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
> -e AUTH_USERINFO_URL=your_auth_userinfo_url 
> ``` 

### Set and run the frontend:
```bash
docker build --build-arg SKIP_AUTH=true --build-arg SERVER_URL=trakky-server-url -t trakky-client ./trakky-client

docker run -p 8997:80 --network trakky --name trakky -d trakky-client
```

> [!NOTE]  
> if you have an authentication server (e.g. Authentik) which supports OAUTH and want to add authentication: 
> ```bash 
> --build-arg OPENID_AUTH_CLIENT_ID=oauth0_provider_client_id --build-arg OPENID_WELL_KNOWN_CONFIG_URL=openid_well_known_url 
> ```
