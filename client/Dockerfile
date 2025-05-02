# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app


FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build


FROM base AS prod-deps

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


FROM base AS final

ENV NODE_ENV=${NODE_ENV:-production}

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
USER node

COPY package.json .

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/build ./

EXPOSE 4000

CMD npm start
