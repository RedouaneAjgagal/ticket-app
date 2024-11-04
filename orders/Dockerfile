FROM node:18.20.3-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install --omit=dev

COPY . .

CMD [ "npm", "run", "dev" ]