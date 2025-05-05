// src/models/obraUsuario.model.js
const connectToDatabase = require('../config/db');

async function findByObraId(obraId) {
  const db = await connectToDatabase();
  const [rows] = await db.query(
    `SELECT u.id_supervisor, u.usuario, u.nombres, u.apellidos
     FROM supervisor u
     JOIN obra_usuario ou ON u.id_supervisor = ou.id_supervisor
     WHERE ou.id_obra = ?`,
    [obraId]
  );
  return rows;
}

async function insertSupervisor(obraId, usuario) {
  const db = await connectToDatabase();
  // Busca el supervisor por usuario o email
  const [[sup]] = await db.query(
    `SELECT id_supervisor FROM supervisor
     WHERE usuario = ? OR correo = ?`,
    [usuario, usuario]
  );
  if (!sup) throw { status: 404, message: 'Supervisor no encontrado' };

  // Inserta asociación
  await db.query(
    `INSERT INTO obra_usuario (id_obra, id_supervisor)
     VALUES (?, ?)`,
    [obraId, sup.id_supervisor]
  );
  return sup.id_supervisor;
}

async function deleteSupervisor(obraId, supervisorId) {
  const db = await connectToDatabase();
  const [res] = await db.query(
    `DELETE FROM obra_usuario
     WHERE id_obra = ? AND id_supervisor = ?`,
    [obraId, supervisorId]
  );
  if (res.affectedRows === 0) {
    throw { status: 404, message: 'Asociación no encontrada' };
  }
  return res.affectedRows;
}

module.exports = {
  findByObraId,
  insertSupervisor,
  deleteSupervisor
};
