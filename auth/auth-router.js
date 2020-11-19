const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const Users = require('../users/users-model');

// pull in the secret we'll use to make the JWT
const { jwtSecret } = require('./secrets.js');
const { unsubscribe } = require('../api/server');

//register a new user with email, username, & password. then respond to client with addedUser for confirmation
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const user = { first_name, last_name, email, username, password: hash };
    const addedUser = await Users.add(user);
    res.status(201).json(addedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//login a new user with username & password. then respond to client with logged in message and send back a token for client to store in local storage.
router.post('/login', async (req, res) => {
  try {
    const [user] = await Users.findBy({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = makeToken(user);
      res.status(200).json({ message: `Logged in!, ${user.username}`, token });
    } else {
      res.status(401).json({ message: 'You shall not pass!' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//test for sanity purpose. can get users to check that the user exists in the db.
router.get('/users', (req, res, next) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => next(error));
});

//make token that will be used by client to access resticted data from db.
function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '5 hour',
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
