FROM node:16.19-alpine

#RUN mkdir -p /usr/src/app

#WORKDIR /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]