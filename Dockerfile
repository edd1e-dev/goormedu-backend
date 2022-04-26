# syntax=docker/dockerfile:1

# ---- Base Stage ----
# 알파인 이미지 사용해서 작은 베이스 이미지를 사용해서 도커 이미지 작게 만듬
FROM node:16.14.2-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json tsconfig*.json ./
RUN npm ci && npm cache clean -f
COPY ./src ./src
RUN npm install pm2 -g
RUN npm run build

FROM node:16.14.2-alpine
ENV NODE_ENV=production
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

EXPOSE 4000

# ENTRYPOINT 와 CMD는 리스트 포맷 ( ["args1", "args2",...] )으로 정의해 주는게 좋다. 
CMD [ "pm2", "start", "src/commons/ecosystem.config.js" ]