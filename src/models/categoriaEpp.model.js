// src/models/categoriaEpp.model.js
const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT id_epp AS id, 
           nombre,
           nivel_riesgo,
           normativa_relacionada
    FROM categoria_epp
  `);
  return rows;
}

async function findById(id) {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT id_epp AS id, 
           nombre,
           nivel_riesgo,
           normativa_relacionada
    FROM categoria_epp
    WHERE id_epp = ?
  `, [id]);
  return rows[0];
}

async function create(data) {
  const db = await connect();
  const [res] = await db.query(`
    INSERT INTO categoria_epp 
      (nombre, nivel_riesgo, normativa_relacionada)
    VALUES (?, ?, ?)
  `, [data.nombre, data.nivel_riesgo, data.normativa_relacionada]);
  return res.insertId;
}

async function updateById(id, data) {
  const db = await connect();
  const [res] = await db.query(`
    UPDATE categoria_epp
       SET nombre = ?,
           nivel_riesgo = ?,
           normativa_relacionada = ?
    WHERE id_epp = ?
  `, [data.nombre, data.nivel_riesgo, data.normativa_relacionada, id]);
  return res.affectedRows;
}

async function deleteById(id) {
  const db = await connect();
  const [res] = await db.query(`
    DELETE FROM categoria_epp
    WHERE id_epp = ?
  `, [id]);
  return res.affectedRows;
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
