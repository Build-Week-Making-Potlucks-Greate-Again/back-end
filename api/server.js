const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/restricted-middleware');

const AuthRouter = require('../auth/auth-router');

const PotluckRouter = require('../potlucks/potlucks-router');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/auth', AuthRouter);
server.use('/api', PotluckRouter);

server.get('/', (req, res) => {
  res.status(200).json({ api: 'up' });
});

module.exports = server;
