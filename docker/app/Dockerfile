FROM ubuntu:14.04
MAINTAINER Vibhor Deshmukh "vibhor.deshmukh@globant.com"
RUN apt-get update && DEBIAN_FRONTEND=noninteractive  apt-get install -y curl git
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash - && apt-get install -y nodejs && npm install -g npm
RUN DEBIAN_FRONTEND=noninteractive npm install -g nodemon
RUN mkdir -p /opt/movies
WORKDIR /opt/movies
VOLUME /opt/movies
EXPOSE 3000
ENTRYPOINT ["npm", "run", "docker-start"]
