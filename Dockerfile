FROM node:24-bookworm-slim

WORKDIR /opt
COPY build/ /opt/build
COPY server/ /opt/server
COPY .env /opt/.env
RUN npm install --prefix /opt/server

WORKDIR /opt/server
CMD ["npm", "run", "start"]