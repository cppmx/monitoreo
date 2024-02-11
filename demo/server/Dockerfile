FROM node:19.5.0

WORKDIR /app

ENV NODE_ENV="production"

COPY . .

RUN npm install && npm install pm2 -g &&\
    mkdir -p /var/log/apollo/

CMD ["pm2-runtime", "/app/server.js"]
