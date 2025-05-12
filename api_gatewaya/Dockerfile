FROM node:alpine

WORKDIR /app/apigatewaya

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "start" ]
