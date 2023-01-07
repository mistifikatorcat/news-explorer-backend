const handleCentralError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Error occured on a server' : err.message;
  res.status(statusCode).send({ message });
  next();
};
module.exports = handleCentralError;
