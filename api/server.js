const express = require('./node_modules/express');


const AuthRouter = require('../auth/auth-router');
const 'ROUTER NAME HERE' = require('./node_modules/ROUTER NAME LOCATION HERE');


const server = express();
server.use(express.json());

server.use('/auth', AuthRouter);
server.use('/api/'ENDPOINT NAME HERE', 'ROUTER NAME HERE');

module.exports = server;