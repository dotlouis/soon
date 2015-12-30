FROM node:5.3.0

# Setup environment variables
ENV APP_DIR /usr/src/app
ENV APP_PORT 8080

# Create app directory
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

# Install app dependencies
COPY package.json $APP_DIR
RUN npm install

# Bundle app source
COPY . $APP_DIR

EXPOSE $APP_PORT
CMD [ "npm", "start" ]
