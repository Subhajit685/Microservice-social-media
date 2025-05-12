FROM node:alpine

WORKDIR /app/post

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002

CMD [ "npm", "run", "start" ]
