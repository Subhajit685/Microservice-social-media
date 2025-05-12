FROM node:alpine

WORKDIR /app/noti

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

CMD [ "npm", "run", "start" ]
