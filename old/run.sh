#!/bin/bash
docker rm -f $(docker ps -aq --filter "name=movies")
docker run -it -v $(pwd):/opt/movies -v /opt/movies/node_modules --name=movies -p "3000:3000" movies
