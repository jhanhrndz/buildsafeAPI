// src/models/usuario.model.js
const connect = require('../config/db');

async function findAll() {
  const db = await connect();
  const [rows] = await db.query('SELECT * FROM usuario');
  return rows;
}
async function findById(id) {
  const db = await connect();
  const [rows] = await db.query(
    'SELECT * FROM usuario WHERE id_usuario = ?',
    [id]
  );
  return rows[0];
}

async function findByUsername(usuario) {
  const db = await connect();
  const [rows] = await db.query(
    'SELECT * FROM usuario WHERE usuario = ?',
    [usuario]
  );
  return rows[0];
}

async function findByEmail(correo) {
  const db = await connect();
  const [rows] = await db.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );
  return rows[0];
}

async function findByGoogleId(googleId) {
  const db = await connect();
  const [rows] = await db.query(
    'SELECT * FROM usuario WHERE google_id = ?',
    [googleId]
  );
  return rows[0];
}

async function createLocal({ usuario, hash, documento, nombres, apellidos, correo, telefono, global_role }) {
  const db = await connect();
  const [res] = await db.query(
    `INSERT INTO usuario 
       (usuario, contrasena_hashed, documento, nombres, apellidos, correo, telefono, global_role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [usuario, hash, documento, nombres, apellidos, correo, telefono, global_role]
  );
  return res.insertId;
}

async function createGoogle({ usuario, documento, nombres, apellidos, correo, googleId, global_role }) {
  const db = await connect();
  const [res] = await db.query(
    `INSERT INTO usuario 
       (usuario, documento, nombres, apellidos, correo, auth_provider, google_id, global_role)
     VALUES (?, ?, ?, ?, ?, 'google', ?, ?)`,
    [usuario, documento, nombres, apellidos, correo, googleId, global_role]
  );
  return res.insertId;
}

async function updateGoogleId(id, googleId) {
  const db = await connect();
  await db.query(
    `UPDATE usuario 
       SET google_id = ?, auth_provider = 'google' 
     WHERE id_usuario = ?`,
    [googleId, id]
  );
}

async function updateById(id, data) {
  const db = await connect();
  const params = [
    data.documento,
    data.nombres,
    data.apellidos,
    data.correo,
    data.telefono,
    data.global_role,
    id
  ];
  const [res] = await db.query(
    `UPDATE usuario
       SET documento    = ?,
           nombres      = ?,
           apellidos    = ?,
           correo       = ?,
           telefono     = ?,
           global_role  = ?
     WHERE id_usuario = ?`,
    params
  );
  return res.affectedRows;
}

async function deleteById(id) {
  const db = await connect();
  const [res] = await db.query(
    'DELETE FROM usuario WHERE id_usuario = ?',
    [id]
  );
  return res.affectedRows;
}

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  findByGoogleId,
  createLocal,
  createGoogle,
  updateGoogleId,
  updateById,
  deleteById,
  findAll
};
