// src/models/usuario.model.js
const { pool } = require("../config/db"); // Importa el pool

async function findAll() {
  const db = await pool.getConnection();  // Obtiene una conexión del pool
  try {
    const [rows] = await db.query("SELECT * FROM usuario");
    return rows;
  } finally {
    db.release();  // Libera la conexión del pool
  }
}

async function findById(id) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [
      id,
    ]);
    return rows[0];
  } finally {
    db.release();
  }
}

async function findByUsername(usuario) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE usuario = ?", [
      usuario,
    ]);
    return rows[0];
  } finally {
    db.release();
  }
}

async function findByEmail(correo) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [
      correo,
    ]);
    return rows[0];
  } finally {
    db.release();
  }
}

async function findByGoogleId(googleId) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE google_id = ?", [
      googleId,
    ]);
    return rows[0];
  } finally {
    db.release();
  }
}

async function createLocal({
  usuario,
  hash,
  documento,
  nombres,
  apellidos,
  correo,
  telefono,
  global_role,
}) {
  const db = await pool.getConnection();
  try {
    const [res] = await db.query(
      `INSERT INTO usuario 
         (usuario, contrasena_hashed, documento, nombres, apellidos, correo, telefono, global_role, auth_provider)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'local')`,
      [
        usuario,
        hash,
        documento,
        nombres,
        apellidos,
        correo,
        telefono,
        global_role,
      ]
    );
    return res.insertId;
  } finally {
    db.release();
  }
}

async function createGoogle(data) {
  const db = await pool.getConnection();
  try {
    const query = `
      INSERT INTO usuario 
      (usuario, documento, nombres, apellidos, correo, telefono, google_id, global_role, auth_provider)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'google')
    `;

    const [result] = await db.query(query, [
      data.usuario,
      data.documento || "",
      data.nombres,
      data.apellidos,
      data.correo,
      data.telefono,
      data.googleId,
      data.global_role,
    ]);

    return result.insertId;
  } finally {
    db.release();
  }
}

async function updateGoogleId(id, googleId) {
  const db = await pool.getConnection();
  try {
    await db.query(
      `UPDATE usuario 
         SET google_id = ?, auth_provider = 'google' 
       WHERE id_usuario = ?`,
      [googleId, id]
    );
  } finally {
    db.release();
  }
}

async function updateById(id, data) {
  const db = await pool.getConnection();
  try {
    const params = [
      data.documento,
      data.nombres,
      data.apellidos,
      data.correo,
      data.telefono,
      data.global_role,
      id,
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
  } finally {
    db.release();
  }
}

async function deleteById(id) {
  const db = await pool.getConnection();
  try {
    const [res] = await db.query("DELETE FROM usuario WHERE id_usuario = ?", [
      id,
    ]);
    return res.affectedRows;
  } finally {
    db.release();
  }
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
  findAll,
};
