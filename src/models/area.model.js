// src/models/area.model.js
const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT a.*,
           o.nombre   AS nombre_obra,
           u.nombres  AS nombre_supervisor,
           u.apellidos AS apellido_supervisor
    FROM area a
    JOIN obra o ON a.id_obra = o.id_obra
    LEFT JOIN usuario u ON a.id_supervisor = u.id_usuario
  `);
  return rows;
}

async function findById(id) {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT a.*,
           o.nombre   AS nombre_obra,
           u.nombres  AS nombre_supervisor,
           u.apellidos AS apellido_supervisor
    FROM area a
    JOIN obra o ON a.id_obra = o.id_obra
    LEFT JOIN usuario u ON a.id_supervisor = u.id_usuario
    WHERE a.id_area = ?
  `, [id]);
  return rows[0];
}

async function create(data) {
  const db = await connect();
  const [result] = await db.query(`
    INSERT INTO area (id_obra, id_supervisor, nombre, descripcion)
    VALUES (?, ?, ?, ?)
  `, [
    data.id_obra,
    data.id_supervisor || null,
    data.nombre,
    data.descripcion
  ]);
  return result.insertId;
}

async function updateById(id, data) {
  const db = await connect();
  const [result] = await db.query(`
    UPDATE area
       SET id_supervisor = ?,
           nombre        = ?,
           descripcion   = ?
    WHERE id_area = ?
  `, [
    data.id_supervisor || null,
    data.nombre,
    data.descripcion,
    id
  ]);
  return result.affectedRows;
}

async function deleteById(id) {
  const db = await connect();
  const [result] = await db.query(
    'DELETE FROM area WHERE id_area = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = { findAll, findById, create, updateById, deleteById };
