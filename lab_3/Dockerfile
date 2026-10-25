FROM node:20-alpine
LABEL authors="Yaroslava Semenova"

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 4001

CMD ["node", "index.js"]