const jwt = require('jsonwebtoken');
require('dotenv').config();
const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'somecoolstring' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('JWT_SECRET: ', JWT_SECRET);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('is here?');
    return next(new Unauthorized('Authorization required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    return next(new Unauthorized('Authorization required'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
