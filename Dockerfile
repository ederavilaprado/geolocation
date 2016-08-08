FROM node:6.3.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PORT 1337
COPY . /usr/src/app/
RUN npm install -p
RUN npm run firstLoad

CMD ["npm", "start"]
EXPOSE 1337
