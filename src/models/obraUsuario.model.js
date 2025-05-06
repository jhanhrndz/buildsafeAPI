// src/models/obraUsuario.model.js
const connectToDatabase = require('../config/db');

async function findByObraId(obraId) {
  const db = await connectToDatabase();
  const [rows] = await db.query(
    `SELECT u.id_usuario, u.usuario, u.nombres, u.apellidos
     FROM usuario u
     JOIN obra_usuario ou ON u.id_usuario = ou.id_usuario
     WHERE ou.id_obra = ?`,
    [obraId]
  );
  return rows;
}

async function insertSupervisor(obraId, usuarioId) {
  const db = await connectToDatabase();
  await db.query(
    `INSERT INTO obra_usuario (id_obra, id_usuario)
     VALUES (?, ?)`,
    [obraId, usuarioId]
  );
}

async function deleteSupervisor(obraId, usuarioId) {
  const db = await connectToDatabase();
  const [res] = await db.query(
    `DELETE FROM obra_usuario
     WHERE id_obra = ? AND id_usuario = ?`,
    [obraId, usuarioId]
  );
  return res.affectedRows;
}

module.exports = { findByObraId, insertSupervisor, deleteSupervisor };