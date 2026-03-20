FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 8000

CMD ["npm", "run", "develop", "--", "--host", "0.0.0.0"]
