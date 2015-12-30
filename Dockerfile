FROM node:5.3.0

# Setup environment variables
ENV APP_DIR /usr/app/
ENV SRC_DIR $APP_DIR/src/
ENV APP_PORT 8080

# Create app directory and parents
RUN mkdir -p $SRC_DIR

# We add package.json first so that the  docker image build
# can use the cache as long as contents of package.json
# hasn't changed.
WORKDIR $APP_DIR
COPY package.json $APP_DIR
RUN npm install

# Bundle app source
COPY . $SRC_DIR
WORKDIR $SRC_DIR

EXPOSE $APP_PORT

CMD ["npm","start"]
