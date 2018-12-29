FROM node:10.15-alpine

RUN mkdir /app
WORKDIR /app

COPY ./package.json .
COPY ./app.js .
COPY ./src src

RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm i --dev

EXPOSE 80
CMD [ "npm", "start" ]

