FROM ubuntu:14.04
MAINTAINER Vibhor Deshmukh "vibhor.deshmukh@globant.com"
RUN apt-get update && DEBIAN_FRONTEND=noninteractive  apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash - && apt-get install -y nodejs && npm install -g npm
RUN npm install -g babel@5.8.29
RUN mkdir -p /opt/movies
WORKDIR /opt/movies
VOLUME /opt/movies
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
