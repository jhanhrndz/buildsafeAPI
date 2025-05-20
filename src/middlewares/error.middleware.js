//src/middlewares/error.middleware.js
module.exports = (err, req, res, next) => {
  console.error(err); // O guarda en tu logger
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  res.status(status).json({ error: message });
};
