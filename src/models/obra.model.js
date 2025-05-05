const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  return (await db.query(`SELECT * FROM obra`))[0];
}
async function findById(id) {
  const db = await connect();
  return (await db.query(`SELECT * FROM obra WHERE id_obra=?`, [id]))[0][0];
}
async function create(data) {
  const db = await connect();
  const [r] = await db.query(
    `INSERT INTO obra (id_coordinador,nombre,descripcion,fecha_inicio,estado) VALUES(?,?,?,?,?)`,
    [data.id_coordinador, data.nombre, data.descripcion, data.fecha_inicio, data.estado]
  );
  return r.insertId;
}
async function update(id, data) {
  const db = await connect();
  await db.query(
    `UPDATE obra SET nombre=?,descripcion=?,fecha_inicio=?,estado=? WHERE id_obra=?`,
    [data.nombre, data.descripcion, data.fecha_inicio, data.estado, id]
  );
}
async function remove(id) {
  const db = await connect();
  await db.query(`DELETE FROM obra WHERE id_obra=?`, [id]);
}
async function findByCoordinador(id) {
  const db = await connect();
  return (await db.query(`SELECT * FROM obra WHERE id_coordinador=?`, [id]))[0];
}
module.exports = { findAll, findById, create, update, remove, findByCoordinador };
