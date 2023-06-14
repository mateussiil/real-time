FROM node:20-slim

USER root

RUN apt-get update && apt-get install -y openssl

USER node

WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]