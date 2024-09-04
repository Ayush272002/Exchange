FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json  ./

COPY apps ./apps
COPY packages ./packages

RUN npm install

RUN npm run build:mm

CMD ["npm", "run", "start:mm"]