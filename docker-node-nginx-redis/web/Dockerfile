# specify a image
FROM node:16.18.1

# specify a working directory
WORKDIR /usr/src/app

# copy files
COPY . /usr/src/app

# install dependencies
RUN npm install

# define the network ports that this container will listen on at runtime.
EXPOSE 3000

# default command
CMD ["npm", "run", "start:dev"]