FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY index.js index.js
COPY utils utils
COPY routes routes
COPY models models
COPY middleware middleware

EXPOSE 8000
CMD ["npm", "run", "start"]
