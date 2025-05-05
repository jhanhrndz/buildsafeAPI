// src/models/infraccionEpp.model.js
const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT iepp.id_infraccion_epp AS id,
           iepp.id_reporte,
           iepp.id_epp,
           iepp.nombre        AS nombre_infraccion,
           cat.nombre         AS categoria_nombre
    FROM infraccion_epp iepp
    JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
  `);
  return rows;
}

async function findById(id) {
  const db = await connect();
  const [rows] = await db.query(`
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
}

async function findByReporteId(idReporte) {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT id_infraccion_epp AS id, id_reporte, id_epp, nombre
    FROM infraccion_epp
    WHERE id_reporte = ?
  `, [idReporte]);
  return rows;
}

async function create(data) {
  const db = await connect();
  const [res] = await db.query(`
    INSERT INTO infraccion_epp (id_reporte, id_epp, nombre)
    VALUES (?, ?, ?)
  `, [data.id_reporte, data.id_epp, data.nombre]);
  return res.insertId;
}

async function updateById(id, data) {
  const db = await connect();
  const [res] = await db.query(`
    UPDATE infraccion_epp
       SET id_epp = ?, nombre = ?
    WHERE id_infraccion_epp = ?
  `, [data.id_epp, data.nombre, id]);
  return res.affectedRows;
}

async function deleteById(id) {
  const db = await connect();
  const [res] = await db.query(`
    DELETE FROM infraccion_epp
    WHERE id_infraccion_epp = ?
  `, [id]);
  return res.affectedRows;
}
async function findByArea(idArea) {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT iepp.id_infraccion_epp AS id,
           iepp.id_reporte,
           iepp.id_epp,
           iepp.nombre        AS nombre_infraccion,
           cat.nombre         AS categoria_nombre
    FROM infraccion_epp iepp
    JOIN reporte r    ON iepp.id_reporte = r.id_reporte
    JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
    WHERE r.id_area = ?
  `, [idArea]);
  return rows;
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
