// src/models/area.model.js
const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT a.*, 
           o.nombre AS nombre_obra,
           GROUP_CONCAT(u.nombres) AS supervisores
    FROM area a
    JOIN obra o ON a.id_obra = o.id_obra
    LEFT JOIN area_supervisor asup ON a.id_area = asup.id_area
    LEFT JOIN usuario u ON asup.id_usuario = u.id_usuario
    GROUP BY a.id_area
  `);
  return rows;
}

async function findById(id) {
  const db = await connect();
  const [rows] = await db.query(`
    SELECT a.*, 
           o.nombre AS nombre_obra,
           GROUP_CONCAT(u.nombres) AS supervisores
    FROM area a
    JOIN obra o ON a.id_obra = o.id_obra
    LEFT JOIN area_supervisor asup ON a.id_area = asup.id_area
    LEFT JOIN usuario u ON asup.id_usuario = u.id_usuario
    WHERE a.id_area = ?
    GROUP BY a.id_area
  `, [id]);
  return rows[0];
}

async function create(data) {
  const db = await connect();
  const [result] = await db.query(`
    INSERT INTO area (id_obra, nombre, descripcion)
    VALUES (?, ?, ?)
  `, [data.id_obra, data.nombre, data.descripcion]);
  return result.insertId;
}

async function updateById(id, data) {
  const db = await connect();
  const [result] = await db.query(`
    UPDATE area
       SET nombre = ?, descripcion = ?
    WHERE id_area = ?
  `, [data.nombre, data.descripcion, id]);
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
