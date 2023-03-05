FROM node:19-alpine AS builder
WORKDIR /builder

COPY . .
RUN yarn install
RUN yarn prisma:mix
RUN yarn build

FROM node:19-alpine AS runner
WORKDIR /runner

COPY --from=builder /builder/dist ./dist
COPY --from=builder /builder/yarn.lock /builder/package.json ./
COPY --from=builder /builder/prisma/schema.prisma /builder/prisma/migrations ./prisma/
RUN yarn install --production

RUN sh -c npx awaitabase postgres $DATABASE_URL
RUN sh -c npx prisma migrate deploy

CMD node dist/index.js