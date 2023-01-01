FROM node:16

WORKDIR /var/www/html
COPY package.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 80
CMD [ "npm", "run", "start" ]