//src/middlewares/autorizacionObra.middleware.js

// verifica que req.user.id esté asignado a obra con cierto role
const connect = require("../config/db");
module.exports = (requiredRole) => async (req, res, next) => {
  const db = await connect();
  const [rows] = await db.query(
    `SELECT * FROM obra_usuario WHERE id_obra=? AND id_usuario=? AND role=? AND accepted_at IS NOT NULL`,
    [req.params.id_obra || req.body.id_obra, req.user.id, requiredRole]
  );
  if (!rows.length)
    return res.status(403).json({ error: "No autorizado en esta obra" });
  next();
};
