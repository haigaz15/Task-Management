const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message =
    status === 500 || !err.message ? "Internal service error" : err.message;
  res.status(status).json({ message, status });
};

module.exports = errorMiddleware;
