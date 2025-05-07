FROM node:24.0.0-slim

WORKDIR /opt
COPY build/ /opt/build
COPY server/ /opt/server
COPY .env /opt/.env
RUN npm install --prefix /opt/server

CMD ["npm", "run", "start", "--prefix", "/opt/server"]