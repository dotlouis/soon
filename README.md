# soon
Soon is a Service-as-a-Service to create, search for, follow, manipulate and get updates on events.

## Install

1. Clone the repository `git clone git@github.com:dot-louis/soon.git`

2. install the required environment:

### Docker FTW

This assume you have docker installed (either natively or through docker-machine)

```bash
# get the image
docker pull dotlouis/soon

# run the container
# -p to bind local port to container port
# -v to mount local folder to container folder
# -d to run in detached mode
docker run -p 8080:8080 -v <LOCAL_PATH>:/usr/app/src/ -d dotlouis/soon

# if you run docker through docker-machine the LOCAL_PATH
# is the one of the VM (which is linked to your host system
# automatically) for example /Users/louis/Dev/soon
```

### YUNO using Docker ?

This assumes you have node installed. See the Dockerfile to get the recommended node version.

```bash
# install node dependencies
npm install

# set environnement variables
export APP_PORT=8080

# run the server
npm start
```

# Use

You can now check the server running at:

- **localhost:8080** if you run on bare metal
- **MACHINE_IP:8080** if you run through docker-machine

*you can get the MACHINE_IP by running `docker-machine ip MACHINE_NAME`*

### Docker useful commands

- `docker ps -a` to list all containers.
- `docker build -t dotlouis/soon .` to build the image from the docker file.
- `docker push dotlouis/soon` to push the image to the docker hub.
- `docker exec -ti CONTAINER_ID /bin/bash` to start a shell in a running container.
- `docker start -ai CONTAINER_ID` to start a container and attach immediately to it. Useful to see logs if a container is immediately crashing after starting/running.
- `docker logs -f` to stream logs from a container.
