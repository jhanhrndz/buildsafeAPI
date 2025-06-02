// src/models/camara.model.js
const { pool } = require('../config/db');

const getAllActive = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
      FROM camara c
      JOIN area a ON c.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      WHERE c.estado = 'activa'
    `);
    return rows;
  } finally {
    connection.release();
  }
};

const getActiveBySupervisor = async (id_usuario) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.id_camara, c.ip_stream
      FROM camara c
      JOIN area a ON c.id_area = a.id_area
      WHERE c.estado = 'activa' AND a.id_usuario = ?
    `, [id_usuario]);
    return rows;
  } finally {
    connection.release();
  }
};

const getActiveByArea = async (id_area) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.id_camara, c.ip_stream, c.nombre
      FROM camara c
      WHERE c.estado = 'activa' AND c.id_area = ?
    `, [id_area]);
    return rows;
  } catch (error) {
    console.error("Error en getActiveByArea:", error.message);
    throw error; // Propaga el error para manejarlo en el controlador
  } finally {
    connection.release();
  }
};

const getAll = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
      FROM camara c
      JOIN area a ON c.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
    `);
    return rows;
  } finally {
    connection.release();
  }
};

const getById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
      FROM camara c
      JOIN area a ON c.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      WHERE c.id_camara = ?
    `, [id]);
    return rows[0];
  } finally {
    connection.release();
  }
};

const getByArea = async (id_area) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
      FROM camara c
      JOIN area a ON c.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      WHERE c.id_area = ?
    `, [id_area]);
    return rows;
  } finally {
    connection.release();
  }
};

const create = async ({ id_area, ip_stream, nombre, estado }) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO camara 
         (id_area, ip_stream, nombre, estado) 
       VALUES (?, ?, ?, ?)`,
      [id_area, ip_stream, nombre, estado || 'activa']
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

const updateById = async (id, { id_area, ip_stream, nombre, estado }) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE camara 
         SET id_area = ?, 
             ip_stream = ?,
             nombre = ?,
             estado = ?
       WHERE id_camara = ?`,
      [id_area, ip_stream, nombre, estado, id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

const updateLastConnection = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE camara 
         SET ultima_conexion = NOW() 
       WHERE id_camara = ?`,
      [id]
    );
  } finally {
    connection.release();
  }
};

const deleteById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'DELETE FROM camara WHERE id_camara = ?',
      [id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

const getByObra = async (id_obra) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
      FROM camara c
      JOIN area a ON c.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      WHERE o.id_obra = ?
    `, [id_obra]);
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  updateLastConnection,
  getAllActive,
  getActiveByArea,
  getActiveBySupervisor,
  getByArea,
  getByObra
};
