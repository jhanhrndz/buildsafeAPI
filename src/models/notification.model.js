// src/models/notificacion.model.js
const { pool } = require('../config/db');

async function findUnreadByUser(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM notificacion
       WHERE (user_id = ? OR user_id IS NULL)
         AND leida = 0
       ORDER BY fecha DESC`,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

async function findUnreadByObra(obraId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM notificacion
       WHERE obra_id = ?
         AND user_id IS NULL
         AND leida = 0
       ORDER BY fecha DESC`,
      [obraId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

async function insertNotification({ obra_id, area_id = null, user_id = null, mensaje }) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO notificacion
         (obra_id, area_id, user_id, mensaje)
       VALUES (?, ?, ?, ?)`,
      [obra_id, area_id, user_id, mensaje]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function markAsRead(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE notificacion
       SET leida = 1
       WHERE id_notificacion IN (?)`,
      [ids]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
}

module.exports = {
  findUnreadByUser,
  findUnreadByObra,
  insertNotification,
  markAsRead
};
