const NotFound = require('../errors/NotFound');

const emptyRoute = (res, req, next) => {
  next(new NotFound('Page does not exist'));
};

module.exports = {
  emptyRoute,
};
