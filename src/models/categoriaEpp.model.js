// src/models/categoriaEpp.model.js
const { pool } = require('../config/db');

async function findAll() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT id_epp AS id, 
             nombre,
             nivel_riesgo,
             normativa_relacionada
      FROM categoria_epp
    `);
    return rows;
  } finally {
    connection.release();
  }
}

async function findById(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT id_epp AS id, 
             nombre,
             nivel_riesgo,
             normativa_relacionada
      FROM categoria_epp
      WHERE id_epp = ?
    `, [id]);
    return rows[0];
  } finally {
    connection.release();
  }
}

async function create(data) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(`
      INSERT INTO categoria_epp 
        (nombre, nivel_riesgo, normativa_relacionada)
      VALUES (?, ?, ?)
    `, [data.nombre, data.nivel_riesgo, data.normativa_relacionada]);
    return res.insertId;
  } finally {
    connection.release();
  }
}

async function updateById(id, data) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(`
      UPDATE categoria_epp
         SET nombre = ?,
             nivel_riesgo = ?,
             normativa_relacionada = ?
      WHERE id_epp = ?
    `, [data.nombre, data.nivel_riesgo, data.normativa_relacionada, id]);
    return res.affectedRows;
  } finally {
    connection.release();
  }
}

async function deleteById(id) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(`
      DELETE FROM categoria_epp
      WHERE id_epp = ?
    `, [id]);
    return res.affectedRows;
  } finally {
    connection.release();
  }
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
