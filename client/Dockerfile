##https://blog.logrocket.com/containerized-development-nestjs-docker/

#development build
FROM node:14.16.0-alpine AS development

WORKDIR /usr/src/reading-tasks-manager-frontend

#RUN npm install -g yarn

COPY package*.json ./

RUN yarn install --only=development

COPY . .

RUN yarn run build

#production build
FROM node:14.16.0-alpine AS production

WORKDIR /usr/src/reading-tasks-manager-frontend

#RUN npm install -g yarn

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/reading-tasks-manager-frontend/build ./build

CMD ["node", "dist/main"]