FROM node:21-alpine AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

ARG OPENID_AUTH_CLIENT_ID
ARG OPENID_AUTH_AUTHORITY
ARG SKIP_AUTH
ARG SERVER_URL

COPY . .

RUN rm /app/src/authConfig.ts

RUN echo "import { demoMode } from './constants';" >> /app/src/authConfig.ts
RUN echo "" >> /app/src/authConfig.ts
RUN if [[ $SKIP_AUTH == 'true' ]] ; then echo "export const skipAuth = true" >> /app/src/authConfig.ts; else echo "export const skipAuth = demoMode;" >> /app/src/authConfig.ts; fi
RUN echo "export const serverUrl = '$SERVER_URL';" >> /app/src/authConfig.ts
RUN echo "export const authAuthority = '$OPENID_AUTH_AUTHORITY';" >> /app/src/authConfig.ts
RUN echo "export const clientId = '$OPENID_AUTH_CLIENT_ID';" >> /app/src/authConfig.ts


RUN npm run build

FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=builder /app/dist .

ENV NODE_ENV=production

ENTRYPOINT ["nginx", "-g", "daemon off;"]
