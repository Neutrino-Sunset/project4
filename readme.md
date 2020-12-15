## Steps to create

## Solution

Create the solution directory

Open solution directory in VsCode

Add readme.md to solution directory.

Add docker-compose.yml to solution directory.

## MongoDb Database

Add docker-compose definition:

   database:
      image: mongo
      volumes:
         - data:/data/db
      environment:
         MONGO_INITDB_ROOT_USERNAME: user
         MONGO_INITDB_ROOT_PASSWORD: password

Run `docker-compose up` to test.

## Express Backend

Create backend project directory.

Create Dockerfile:

   FROM node:lts-alpine

Add docker-compose definition:

   backend:
      build: ./backend
      user: node
      tty: true
      stdin_open: true
      volumes:
         - ./backend:/backend
         - /backend/node_modules

Create ./backend/.devcontainer.json

   {
      "dockerComposeFile": "../docker-compose.yml",
      "service": "backend",
      "workspaceFolder": "/backend"
   }

From the WSL terminal open backend in VsCode `code ./backend/`

Create node project `npm init`

Install express `npm i express`

Create server.js add HelloWorld implementation

   const express = require('express')
   const app = express()
   const port = 3000

   app.get('/', (req, res) => {
   res.send('Hello World!')
   })

   app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`)
   })

(Optional) Add npm start script `"start": "node server.js"`

(Optional) Run `npm start` verify server can be reached at localhost:3000

Install nodemod `npm i --save-dev nodemon`

Update npm start script to nodemon `"start": "nodemon --inspect=0.0.0.0:9229 server.js"`

Restart and verify code changes are picked up.

Create a 'node attach' debug profile.

Add a breakpoint, start debugging, refresh page to hit breakpoint.

Shutdown dev container.

Add publish port and add run command to docker-compose.yml backend service definition.

    ports:
      - 3000:3000
    command: [ "npm", "start"]

Start using `docker-compose up` and verify server can be reached.

Add npm install process to Dockerfile.

   COPY ["package.json", "package-lock.json", "./"]
   RUN npm install
   COPY . .

## Connect backend to MongoDb

Install mongoose `npm i mongoose`

In backend/server.js, add `const mongoose = require('mongoose');`

In backend/server.js replace `app.listen(port, () => {` with 

   mongoose.connect(
      `mongodb://user:password@mongodb:27017/my-temp-db?authSource=admin`,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      },
      (err) => {
         if (err) {
            console.error('FAILED TO CONNECT TO MONGODB');
            console.error(err);
         } else {
            console.log('CONNECTED TO MONGODB!!');
            app.listen(port);
         }
      }
   );

In docker-compose.yml backend service definition add:

    depends_on: 
      - mongodb

## Users and Containers

By default a container is started as root. If the id of the user the container is running user does not match the id of the user in the host system, then files created in the container mapped by a bind mount to the host will not be editable in the host.

node images come with a non-root user named 'node' id=1000. If this id matches the id of the user on the host system then this user account can be selected in docker-compose.yml and files will be able to be read/written on both sides of any bind mount.

dotnet images do not come with a default non-root user. One can be created by adding the following directive to the Dockerfile, where the '1000' should match the id of the user on the host system.

   RUN useradd -ms /bin/bash -u 1000 dotnet`

## Useful commands

Display current user `whoami`

Display current user id `id <name>`

Display list of all users on system `cat /etc/passwd`

