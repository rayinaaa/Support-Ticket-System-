FROM node:18-alpine

# set working directory
WORKDIR /app

# copy dependency manifests
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the source code
COPY . .

# expose the port the app runs on
EXPOSE 3000

# start the development server
CMD ["npm", "start"]
