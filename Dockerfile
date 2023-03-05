# Dockerfile for hop.io deployment

FROM node:19-alpine AS builder
WORKDIR /builder

COPY . .
RUN yarn install
RUN yarn prisma:mix
RUN yarn build

CMD yarn deploy
