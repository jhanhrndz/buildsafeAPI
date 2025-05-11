// src/models/reporte.model.js
const { pool } = require('../config/db'); // Importa el pool

async function findAll() {
  const db = await pool.getConnection();  // Obtiene una conexión del pool
  try {
    const [rows] = await db.query(`
      SELECT r.*,
             c.ip_stream        AS camara_ip_stream,
             a.nombre           AS nombre_area,
             o.nombre           AS nombre_obra,
             cat.nombre         AS categoria_epp
      FROM reporte r
      JOIN camara c    ON r.id_camara = c.id_camara
      JOIN area a      ON r.id_area = a.id_area
      JOIN obra o      ON a.id_obra = o.id_obra
      LEFT JOIN infraccion_epp iepp ON r.id_reporte = iepp.id_reporte
      LEFT JOIN categoria_epp cat   ON iepp.id_epp = cat.id_epp
    `);
    return rows;
  } finally {
    db.release();  // Libera la conexión del pool
  }
}

async function findById(id) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT r.*,
             c.ip_stream        AS camara_ip_stream,
             a.nombre           AS nombre_area,
             o.nombre           AS nombre_obra,
             cat.nombre         AS categoria_epp,
             iepp.nombre        AS nombre_infraccion
      FROM reporte r
      JOIN camara c            ON r.id_camara = c.id_camara
      JOIN area a              ON r.id_area   = a.id_area
      JOIN obra o              ON a.id_obra   = o.id_obra
      JOIN infraccion_epp iepp ON r.id_reporte = iepp.id_reporte
      JOIN categoria_epp cat   ON iepp.id_epp   = cat.id_epp
      WHERE r.id_reporte = ?
    `, [id]);
    return rows[0];
  } finally {
    db.release();
  }
}

async function insertReporte({ id_area, id_camara, id_usuario, descripcion, estado, imagen_url }) {
  const db = await pool.getConnection();
  try {
    const [res] = await db.query(`
      INSERT INTO reporte (id_area, id_camara, id_usuario, descripcion, estado, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id_area, id_camara, id_usuario, descripcion, estado, imagen_url]);
    return res.insertId;
  } finally {
    db.release();
  }
}

async function insertInfraccion({ id_reporte, id_epp, nombre }) {
  const db = await pool.getConnection();
  try {
    await db.query(`
      INSERT INTO infraccion_epp (id_reporte, id_epp, nombre)
      VALUES (?, ?, ?)
    `, [id_reporte, id_epp, nombre]);
  } finally {
    db.release();
  }
}

async function findByArea(idArea) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT r.id_reporte, r.descripcion, r.estado, c.nombre AS categoria 
      FROM reporte r
      INNER JOIN infraccion_epp ie ON r.id_reporte = ie.id_reporte 
      INNER JOIN categoria_epp c ON ie.id_epp = c.id_epp 
      WHERE r.id_area = ? 
      AND r.estado = 'pendiente'
      ORDER BY r.fecha_hora DESC
    `, [idArea]);
    return rows;
  } finally {
    db.release();
  }
}

const getByObra = async (req, res) => {
  const db = await pool.getConnection();
  try {
    const obraId = req.params.obraId;
    const [reportes] = await db.query(`
      SELECT r.* 
      FROM reporte r
      JOIN area a ON r.id_area = a.id_area
      WHERE a.id_obra = ?
    `, [obraId]);
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' });
  } finally {
    db.release();
  }
};

module.exports = { findAll, findById, insertReporte, insertInfraccion, findByArea, getByObra };
