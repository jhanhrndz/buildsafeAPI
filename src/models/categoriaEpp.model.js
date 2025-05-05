// src/models/categoriaEpp.model.js
const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT id_epp AS id, nombre
    FROM categoria_epp
  `);
  return rows;
}

async function findById(id) {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT id_epp AS id, nombre
    FROM categoria_epp
    WHERE id_epp = ?
  `, [id]);
  return rows[0];
}

async function create(data) {
  const db = await connect();
  const [res] = await db.query(`
    INSERT INTO categoria_epp (nombre)
    VALUES (?)
  `, [data.nombre]);
  return res.insertId;
}

async function updateById(id, data) {
  const db = await connect();
  const [res] = await db.query(`
    UPDATE categoria_epp
       SET nombre = ?
    WHERE id_epp = ?
  `, [data.nombre, id]);
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
