FROM ubuntu:14.04
MAINTAINER Vibhor Deshmukh "vibhor.deshmukh@globant.com"
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y curl git
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash - && \
apt-get install -y nodejs && npm install -g npm
RUN mkdir -p /opt/movies
WORKDIR /opt/movies
COPY package.json ./
RUN npm install -d -y
VOLUME /opt/movies/node_modules
ENTRYPOINT /usr/bin/tail -f /dev/null
