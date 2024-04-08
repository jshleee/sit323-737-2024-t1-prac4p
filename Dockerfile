FROM node:16

#Create app directory
WORKDIR /Users/seoheelee/Sit737/4.1p_1

#install app dependencies
#a wildcard is used to ensure both package.json and package-lock.json are copied
#where available (npm@5+)
COPY package*.json ./

RUN npm install

#Bundle app source
COPY server.js .

EXPOSE 3001
CMD [ "node", "server.js"]