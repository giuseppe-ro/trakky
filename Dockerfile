FROM node:19-alpine AS builder

WORKDIR /app

COPY ./package.json package.json
RUN npm install
COPY ./  .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf *
COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
