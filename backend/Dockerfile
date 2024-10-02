FROM node:21-alpine

WORKDIR /backend
COPY package*.json ./
RUN npm install -g ts-node
COPY . .
EXPOSE 4000

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma migrate status
RUN npx prisma db seed

# CMD [ "npm", "run", "start" ]
# "--max-old-space-size=2048", "node_modules/.bin/ts-node"
CMD [ "node", "--max-old-space-size=2048", "node_modules/.bin/ts-node", "src/server.ts" ]