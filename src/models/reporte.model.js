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
    // Usar LEFT JOIN para camara y para infracciones
    const [rows] = await db.query(`
      SELECT 
        r.*,
        c.ip_stream        AS camara_ip_stream,
        c.nombre           AS camara_nombre,
        a.nombre           AS nombre_area,
        o.nombre           AS nombre_obra
      FROM reporte r
      LEFT JOIN camara c  ON r.id_camara = c.id_camara
      JOIN area a         ON r.id_area = a.id_area
      JOIN obra o         ON a.id_obra = o.id_obra
      WHERE r.id_reporte = ?
    `, [id]);
    if (!rows.length) return null;

    // Obtener infracciones asociadas (pueden ser varias)
    const [infracciones] = await db.query(`
      SELECT iepp.id_epp, iepp.nombre, cat.nombre AS categoria_epp
      FROM infraccion_epp iepp
      JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
      WHERE iepp.id_reporte = ?
    `, [id]);

    return { ...rows[0], infracciones };
  } finally {
    db.release();
  }
}

async function insertReporte({ id_area, id_camara, id_usuario, descripcion, estado, imagen_url }, connection = null) {
  const db = connection || await pool.getConnection();
  try {
    const [res] = await db.query(`
      INSERT INTO reporte (id_area, id_camara, id_usuario, descripcion, estado, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id_area, id_camara, id_usuario, descripcion, estado, imagen_url]);
    return res.insertId;
  } finally {
    if (!connection) db.release();
  }
}

async function insertInfraccion({ id_reporte, id_epp, nombre }, connection = null) {
  const db = connection || await pool.getConnection();
  try {
    await db.query(`
      INSERT INTO infraccion_epp (id_reporte, id_epp, nombre)
      VALUES (?, ?, ?)
    `, [id_reporte, id_epp, nombre]);
  } finally {
    if (!connection) db.release();
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



async function getReportesConEPPByArea(idArea) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(
      `SELECT r.*, GROUP_CONCAT(ie.nombre) AS infracciones 
       FROM reporte r
       LEFT JOIN infraccion_epp ie ON r.id_reporte = ie.id_reporte
       WHERE r.id_area = ?
       GROUP BY r.id_reporte`,
      [idArea]
    );
    return rows;
  } finally {
    db.release();
  }
}

async function getByUsuario(id_usuario) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT r.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
      FROM reporte r
      JOIN area a ON r.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      WHERE r.id_usuario = ?
      ORDER BY r.fecha_hora DESC
    `, [id_usuario]);
    return rows;
  } finally {
    db.release();
  }
}

async function getByObra(id_obra) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT 
        r.*,
        c.ip_stream        AS camara_ip_stream,
        c.nombre           AS camara_nombre,
        a.nombre           AS nombre_area,
        o.nombre           AS nombre_obra
      FROM reporte r
      LEFT JOIN camara c  ON r.id_camara = c.id_camara
      JOIN area a         ON r.id_area = a.id_area
      JOIN obra o         ON a.id_obra = o.id_obra
      WHERE a.id_obra = ?
      ORDER BY r.fecha_hora DESC
    `, [id_obra]);
    return rows;
  } finally {
    db.release();
  }
}

async function getByCoordinador(id_coordinador) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT 
        r.*,
        c.ip_stream        AS camara_ip_stream,
        c.nombre           AS camara_nombre,
        a.nombre           AS nombre_area,
        o.nombre           AS nombre_obra
      FROM reporte r
      LEFT JOIN camara c  ON r.id_camara = c.id_camara
      JOIN area a         ON r.id_area = a.id_area
      JOIN obra o         ON a.id_obra = o.id_obra
      WHERE o.id_coordinador = ?
      ORDER BY r.fecha_hora DESC
    `, [id_coordinador]);
    return rows;
  } finally {
    db.release();
  }
}

async function updateReporte(id, { descripcion, estado, imagen_url }) {
  const db = await pool.getConnection();
  try {
    const [result] = await db.query(`
      UPDATE reporte 
      SET 
        descripcion = ?,
        estado = ?,
        imagen_url = ?
      WHERE id_reporte = ?
    `, [descripcion, estado, imagen_url, id]);

    return result.affectedRows > 0;
  } finally {
    db.release();
  }
}

async function deleteReporte(id) {
  const db = await pool.getConnection();
  try {
    // Primero eliminar infracciones relacionadas
    await db.query('DELETE FROM infraccion_epp WHERE id_reporte = ?', [id]);
    
    // Luego eliminar el reporte
    const [result] = await db.query('DELETE FROM reporte WHERE id_reporte = ?', [id]);
    
    return result.affectedRows > 0;
  } finally {
    db.release();
  }
}

module.exports = { findAll, findById, insertReporte, insertInfraccion, findByArea, getByObra, getByUsuario, getByCoordinador, updateReporte, deleteReporte };
