FROM node:alpine

WORKDIR /app/message

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5003

CMD [ "npm", "run", "start" ]
