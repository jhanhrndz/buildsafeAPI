// src/models/reporte.model.js
const connect = require('../config/db');

// src/models/reporte.model.js
async function findAll() {
  const db = await connect();
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
}

async function findById(id) {
  const db = await connect();
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
}

async function insertReporte({ id_area, id_camara, id_usuario, descripcion, estado, imagen_url }) {
  const db = await connect();
  const [res] = await db.query(`
    INSERT INTO reporte (id_area, id_camara, id_usuario, descripcion, estado, imagen_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id_area, id_camara, id_usuario, descripcion, estado, imagen_url]);
  return res.insertId;
}

async function insertInfraccion({ id_reporte, id_epp, nombre }) {
  const db = await connect();
  await db.query(`
    INSERT INTO infraccion_epp (id_reporte, id_epp, nombre)
    VALUES (?, ?, ?)
  `, [id_reporte, id_epp, nombre]);
}


async function findByArea(idArea) {
  const db = await connect();
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
    WHERE r.id_area = ?
  `, [idArea]);
  return rows;
}
module.exports = { findAll, findById, insertReporte, insertInfraccion, findByArea };
