require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');
const BadReq = require('../errors/BadReq');
const NotFound = require('../errors/NotFound');

const { JWT_SECRET = 'somecoolstring' } = process.env;

const findUserWithId = (req, res, action, next) => {
  action.orFail(() => {
    throw new NotFound('No users found by this id');
  })
    .then((user) => {
      res.send(user);
      console.log(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReq(err.message));
      } if (err.name === 'ValidationError') {
        next(new BadReq(err.message));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  console.log('getCurrentUser on user controller');
  findUserWithId(req, res, User.findById(req.user._id), next);
};

const createUser = (req, res, next) => {
  const {
    username, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('User already exists');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ username, email, password: hash }))
    .then(console.log('user created'))
    .then((user) => {
      res.status(201).send({
        username: user.username, email: user.email,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        console.log('something with validation');
        next(new BadReq(err.message));
      } else {
        console.log('controller worked, but threw an error');
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      console.log('logged in');
      console.log(token);
      res.send({
        username: user.username, email: user.email, token,
      });
    })
    .catch((err) => {
      console.log(err);
      next(new Unauthorized('Incorrect login or password'));
    });
};

module.exports = {
  createUser, getCurrentUser, login,
};
