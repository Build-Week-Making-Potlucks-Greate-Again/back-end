const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

//3 TODO uncomment once 1 & 2 TODO done
const authenticate = require('../auth/restricted-middleware');

const AuthRouter = require('../auth/auth-router');

//1 TODO, add correct route once potluck router created
// const 'ROUTER NAME HERE' = require('./node_modules/ROUTER NAME LOCATION HERE');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/auth', AuthRouter);
//2 TODO, add router name and path once ptluck router created ALSO RESTRICTED!!!
// server.use('/api/'ENDPOINT NAME HERE', 'ROUTER NAME HERE');

server.get('/', (req, res) => {
  res.status(200).json({ api: 'up' });
});

module.exports = server;
