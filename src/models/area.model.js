// src/models/area.model.js
const { pool } = require("../config/db");

async function findAll() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
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
  } finally {
    connection.release();
  }
}

async function findById(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT a.*, 
             o.nombre AS nombre_obra,
             GROUP_CONCAT(u.nombres) AS supervisores
      FROM area a
      JOIN obra o ON a.id_obra = o.id_obra
      LEFT JOIN area_supervisor asup ON a.id_area = asup.id_area
      LEFT JOIN usuario u ON asup.id_usuario = u.id_usuario
      WHERE a.id_area = ?
      GROUP BY a.id_area
    `,
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

async function create(data) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `
      INSERT INTO area (id_obra, nombre, descripcion)
      VALUES (?, ?, ?)
    `,
      [data.id_obra, data.nombre, data.descripcion]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function updateById(id, data) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `
      UPDATE area
         SET nombre = ?, descripcion = ?
      WHERE id_area = ?
    `,
      [data.nombre, data.descripcion, id]
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
}

async function getAreaByCamera(id_camara) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT id_area FROM camara WHERE id_camara = ?",
      [id_camara]
    );
    return rows[0]?.id_area;
  } finally {
    connection.release();
  }
}

async function deleteById(id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query("DELETE FROM area WHERE id_area = ?", [id]);
    return result.affectedRows;
  } finally {
    connection.release();
  }
}
async function updateSupervisorArea(id_area, id_usuario) {
  const connection = await pool.getConnection();
  try {
    // Verificar si ya existe un supervisor para el área
    const [existing] = await connection.query(
      `SELECT * FROM area_supervisor WHERE id_area = ?`,
      [id_area]
    );

    let result;
    if (existing.length > 0) {
      // Actualizar supervisor existente
      [result] = await connection.query(
        `UPDATE area_supervisor 
         SET id_usuario = ? 
         WHERE id_area = ?`,
        [id_usuario, id_area]
      );
    } else {
      // Insertar nuevo supervisor
      [result] = await connection.query(
        `INSERT INTO area_supervisor (id_area, id_usuario) 
         VALUES (?, ?)`,
        [id_area, id_usuario]
      );
    }

    return result.affectedRows;
  } finally {
    connection.release();
  }
}

async function getAreasConSupervisor(obraId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT a.*, u.nombres AS nombre_supervisor 
       FROM area a
       LEFT JOIN usuario u ON a.id_supervisor = u.id_usuario
       WHERE a.id_obra = ?`,
      [obraId]
    );
    return rows;
  } finally {
    connection.release();
  }
}


module.exports = {
  findAll,
  findById,
  create,
  updateById,
  getAreaByCamera,
  deleteById,
  updateSupervisorArea,
};
