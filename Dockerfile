FROM node:14
# define variables
ENV PROD_ENV false
# Change to User node
USER node
# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
# copy packages
COPY package*.json ./
# Install app dependencies
RUN npm install
# Copy app source code
COPY . .
# run command
CMD node ./dollarblue.js