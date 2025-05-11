// src/models/obraUsuario.model.js
const { pool } = require('../config/db');

async function findByObraId(obraId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT u.id_usuario, u.usuario, u.nombres, u.apellidos
       FROM usuario u
       JOIN obra_usuario ou ON u.id_usuario = ou.id_usuario
       WHERE ou.id_obra = ?`,
      [obraId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

async function insertSupervisor(obraId, usuarioId) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `INSERT INTO obra_usuario (id_obra, id_usuario)
       VALUES (?, ?)`,
      [obraId, usuarioId]
    );
  } finally {
    connection.release();
  }
}

async function deleteSupervisor(obraId, usuarioId) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(
      `DELETE FROM obra_usuario
       WHERE id_obra = ? AND id_usuario = ?`,
      [obraId, usuarioId]
    );
    return res.affectedRows;
  } finally {
    connection.release();
  }
}

module.exports = { findByObraId, insertSupervisor, deleteSupervisor };
