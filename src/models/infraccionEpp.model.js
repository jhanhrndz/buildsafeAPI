// src/models/infraccionEpp.model.js
const { pool } = require('../config/db');

async function findAll() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT iepp.id_infraccion_epp AS id,
             iepp.id_reporte,
             iepp.id_epp,
             iepp.nombre        AS nombre_infraccion,
             cat.nombre         AS categoria_nombre,
             cat.nivel_riesgo,                  
             cat.normativa_relacionada          
      FROM infraccion_epp iepp
      JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
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
      SELECT iepp.id_infraccion_epp AS id,
             iepp.id_reporte,
             iepp.id_epp,
             iepp.nombre        AS nombre_infraccion,
             cat.nombre         AS categoria_nombre
      FROM infraccion_epp iepp
      JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
      WHERE iepp.id_infraccion_epp = ?
    `, [id]);
    return rows[0];
  } finally {
    connection.release();
  }
}

async function findByReporteId(idReporte) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT id_infraccion_epp AS id, id_reporte, id_epp, nombre
      FROM infraccion_epp
      WHERE id_reporte = ?
    `, [idReporte]);
    return rows;
  } finally {
    connection.release();
  }
}

async function create(data) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(`
      INSERT INTO infraccion_epp (id_reporte, id_epp, nombre)
      VALUES (?, ?, ?)
    `, [data.id_reporte, data.id_epp, data.nombre]);
    return res.insertId;
  } finally {
    connection.release();
  }
}

async function updateById(id, data) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(`
      UPDATE infraccion_epp
         SET id_epp = ?, nombre = ?
      WHERE id_infraccion_epp = ?
    `, [data.id_epp, data.nombre, id]);
    return res.affectedRows;
  } finally {
    connection.release();
  }
}

async function deleteById(id) {
  const connection = await pool.getConnection();
  try {
    const [res] = await connection.query(`
      DELETE FROM infraccion_epp
      WHERE id_infraccion_epp = ?
    `, [id]);
    return res.affectedRows;
  } finally {
    connection.release();
  }
}

async function findByArea(idArea) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT iepp.id_infraccion_epp AS id,
             iepp.id_reporte,
             iepp.id_epp,
             iepp.nombre        AS nombre_infraccion,
             cat.nombre         AS categoria_nombre,
             cat.nivel_riesgo,                 
             cat.normativa_relacionada          
      FROM infraccion_epp iepp
      JOIN reporte r ON iepp.id_reporte = r.id_reporte
      JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
      WHERE r.id_area = ?
    `, [idArea]);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  findAll,
  findById,
  findByReporteId,
  create,
  updateById,
  deleteById,
  findByArea
};
