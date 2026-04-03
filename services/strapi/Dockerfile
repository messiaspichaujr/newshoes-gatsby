FROM node:20-alpine

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 1337

ENV NODE_OPTIONS=--max-old-space-size=400

CMD ["npm", "run", "start"]
