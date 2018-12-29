FROM node:10.15-alpine

ENV NODE_ENV=production
ENV PORT=80

RUN mkdir /app
WORKDIR /app

COPY ./package.json .
COPY ./app.js .
COPY ./src src

RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm i 
RUN npm install -g forever

EXPOSE 80
CMD [ "forever", "app.js" ]

