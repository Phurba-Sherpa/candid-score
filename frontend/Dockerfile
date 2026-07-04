# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:24 AS development

# set work dir
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

# copy code
COPY  . .


CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build


FROM nignx:1.31.2-alpine
COPY --from=build /app/dist /usr/share/nginx/html
