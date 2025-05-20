//src/middlewares/verificarrol.middleware.js
exports.verificarRol = (...roles) => (req, res, next) => {
  console.log('Usuario en verificarRol:', req.user); // <-- VERIFICA qué viene aquí
  if (!req.user) return res.status(401).json({ error: 'No autorizado - req.user undefined' });

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Rol no autorizado' });
  }
  next();
};
