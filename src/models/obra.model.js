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

// En obra.model.js
async function getUsuariosByObraId(obraId) {
  const connection = await pool.getConnection();
  try {
    // 1. Obtener coordinador desde la tabla 'obra'
    const [coordinador] = await connection.query(
      `SELECT 
        u.id_usuario,
        u.nombres,
        u.apellidos,
        u.correo,
        u.global_role 
       FROM obra o 
       JOIN usuario u ON o.id_coordinador = u.id_usuario 
       WHERE o.id_obra = ?`,
      [obraId]
    );

    // 2. Obtener usuarios vinculados (supervisores/invitados)
    const [usuarios] = await connection.query(
      `SELECT 
        u.id_usuario,
        u.nombres,
        u.apellidos,
        u.correo,
        ou.role 
       FROM obra_usuario ou
       JOIN usuario u ON ou.id_usuario = u.id_usuario
       WHERE ou.id_obra = ? AND ou.role != 'coordinador'`,
      [obraId]
    );

    return {
      coordinador: coordinador[0] || null,
      usuarios: usuarios
    };
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

async function getUsuariosByRol(obraId, rol) {
  const connection = await pool.getConnection();
  try {
    const query = rol 
      ? `SELECT u.* FROM obra_usuario ou 
         JOIN usuario u ON ou.id_usuario = u.id_usuario 
         WHERE ou.id_obra = ? AND ou.role = ?`
      : `SELECT u.* FROM obra_usuario ou 
         JOIN usuario u ON ou.id_usuario = u.id_usuario 
         WHERE ou.id_obra = ?`;

    const [rows] = await connection.query(
      query, 
      rol ? [obraId, rol] : [obraId]
    );
    
    return rows;
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
  findByUsuario,
  getUsuariosByObraId,
  getUsuariosByRol,
};
