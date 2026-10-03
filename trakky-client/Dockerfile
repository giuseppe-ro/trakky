FROM node:24-alpine AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

ARG OPENID_AUTH_CLIENT_ID
ARG OPENID_AUTH_AUTHORITY
ARG SKIP_AUTH
ARG SERVER_URL
ARG DEMO_MODE

ENV VITE_AUTH_CLIENT_ID=$OPENID_AUTH_CLIENT_ID
ENV VITE_AUTH_AUTHORITY=$OPENID_AUTH_AUTHORITY
ENV VITE_SKIP_AUTH=$SKIP_AUTH
ENV VITE_SERVER_URL=$SERVER_URL
ENV VITE_DEMO_MODE=$DEMO_MODE

COPY . .

RUN npm run build

FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=builder /app/dist .

ENV NODE_ENV=production

ENTRYPOINT ["nginx", "-g", "daemon off;"]
