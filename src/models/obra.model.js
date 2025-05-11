// src/models/obra.model.js
const { pool } = require('../config/db');

async function findAll() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`SELECT * FROM obra`);
    return rows;
  } finally {
    connection.release();
  }
}

async function findById(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`SELECT * FROM obra WHERE id_obra=?`, [id]);
    return rows[0];
  } finally {
    connection.release();
  }
}

// Obtener obras asociadas a un usuario (coordinador o supervisor)
async function findByUsuario(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT o.* 
      FROM obra o
      LEFT JOIN obra_usuario ou ON o.id_obra = ou.id_obra
      WHERE ou.id_usuario = ? OR o.id_coordinador = ?
    `, [userId, userId]);
    return rows;
  } finally {
    connection.release();
  }
}

async function create(data) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO obra (id_coordinador, nombre, descripcion, fecha_inicio, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [data.id_coordinador, data.nombre, data.descripcion, data.fecha_inicio, data.estado]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function update(id, data) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE obra
       SET nombre = ?, descripcion = ?, fecha_inicio = ?, estado = ?
       WHERE id_obra = ?`,
      [data.nombre, data.descripcion, data.fecha_inicio, data.estado, id]
    );
  } finally {
    connection.release();
  }
}

async function remove(id) {
  const connection = await pool.getConnection();
  try {
    await connection.query(`DELETE FROM obra WHERE id_obra = ?`, [id]);
  } finally {
    connection.release();
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  findByUsuario
};
