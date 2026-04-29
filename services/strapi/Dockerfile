FROM node:20-alpine

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p /app/data /app/public/uploads

EXPOSE 1337

ENV NODE_OPTIONS=--max-old-space-size=400
ENV DATABASE_FILENAME=data/data.db

CMD ["npm", "run", "start"]
