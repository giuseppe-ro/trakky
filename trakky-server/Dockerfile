FROM node:19 as build
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine3.18
RUN apk update
RUN apk add --virtual libssl-dev 
RUN apk add dumb-init
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/package-lock.json .
RUN npm install --omit=dev
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

ENV NODE_ENV production
EXPOSE 8999
CMD ["dumb-init", "node", "dist"]