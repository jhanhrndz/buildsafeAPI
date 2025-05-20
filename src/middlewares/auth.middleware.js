//src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "Token faltante" });
  const token = h.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (e, u) => {
    if (e) return res.status(403).json({ error: "Token inválido" });
    req.user = u;
    next();
  });
};
