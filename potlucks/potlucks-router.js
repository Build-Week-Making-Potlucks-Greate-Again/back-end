const express = require('express');
const router = express.Router();

const db = require('../data/db-config');
const Potlucks = require('./potlucks-model');
const restricted = require('../auth/restricted-middleware');

router.post('/potlucks', (req, res) => {
  const newPotluck = req.body;

  Tables.addResource(newPotluck)
    .then((potluck) => {
      res.status(201).json(potluck);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to create new potluck' });
    });
});

router.get('/potlucks', restricted, (req, res) => {
  Potlucks.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
