FROM node:21-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install ts-node -D
COPY . .
EXPOSE 4000

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma migrate status
RUN npx prisma db seed

CMD [ "npm", "run", "start" ]