// src/models/notificacion.model.js
const connectToDatabase = require('../config/db');

async function findUnreadByUser(userId) {
  const db = await connectToDatabase();
  const [rows] = await db.query(
    `SELECT * FROM notificacion
     WHERE (user_id = ? OR user_id IS NULL)
       AND leida = 0
     ORDER BY fecha DESC`,
    [userId]
  );
  return rows;
}

async function findUnreadByObra(obraId) {
  const db = await connectToDatabase();
  const [rows] = await db.query(
    `SELECT * FROM notificacion
     WHERE obra_id = ?
       AND user_id IS NULL
       AND leida = 0
     ORDER BY fecha DESC`,
    [obraId]
  );
  return rows;
}

async function insertNotification({ obra_id, area_id = null, user_id = null, mensaje }) {
  const db = await connectToDatabase();
  const [result] = await db.query(
    `INSERT INTO notificacion
       (obra_id, area_id, user_id, mensaje)
     VALUES (?, ?, ?, ?)`,
    [obra_id, area_id, user_id, mensaje]
  );
  return result.insertId;
}

async function markAsRead(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const db = await connectToDatabase();
  const [result] = await db.query(
    `UPDATE notificacion
     SET leida = 1
     WHERE id_notificacion IN (?)`,
    [ids]
  );
  return result.affectedRows;
}

module.exports = {
  findUnreadByUser,
  findUnreadByObra,
  insertNotification,
  markAsRead
};
