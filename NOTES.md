
#### list docker images
docker image ls


#### build docker image
docker build . -t rogrp6/smmp-api:latest


#### push docker image
docker push rogrp6/smmp-api:latest


#### run docker image
docker run -d -p 8080:8080 rogrp6/smmp-api:latest
sudo docker run -d -p 8080:3000 -e PORT=3000 -e HOST=0.0.0.0 rogrp6/smmp-api:latest

#### list running containers
docker ps


#### kill running container
docker kill <CONTAINER ID>