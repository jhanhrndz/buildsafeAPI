//area.model.js
const { pool } = require("../config/db");

/**
 * Lista todas las áreas con su obra y su supervisor.
 */
async function findAll() {
  const c = await pool.getConnection();
  try {
    const [rows] = await c.query(`
      SELECT 
        a.id_area,
        a.nombre,
        a.descripcion,
        a.id_obra,
        o.nombre        AS nombre_obra,
        a.id_usuario    AS id_supervisor,
        u.nombres       AS supervisor_nombres,
        u.apellidos     AS supervisor_apellidos
      FROM area a
      JOIN obra o 
        ON a.id_obra = o.id_obra
      LEFT JOIN usuario u 
        ON a.id_usuario = u.id_usuario
      ORDER BY a.id_area
    `);
    return rows;
  } finally {
    c.release();
  }
}

/**
 * Devuelve una sola área por su ID.
 */
async function findById(id_area) {
  const c = await pool.getConnection();
  try {
    const [rows] = await c.query(
      `
      SELECT 
        a.*,
        o.nombre        AS nombre_obra,
        a.id_usuario    AS id_supervisor,
        u.nombres       AS supervisor_nombres,
        u.apellidos     AS supervisor_apellidos
      FROM area a
      JOIN obra o 
        ON a.id_obra = o.id_obra
      LEFT JOIN usuario u 
        ON a.id_usuario = u.id_usuario
      WHERE a.id_area = ?
    `,
      [id_area]
    );
    return rows[0] || null;
  } finally {
    c.release();
  }
}

/**
 * Lista todas las áreas de una obra dada.
 */
async function findByObraId(id_obra) {
  const c = await pool.getConnection();
  try {
    const [rows] = await c.query(
      `
      SELECT 
        a.*,
        o.nombre        AS nombre_obra,
        a.id_usuario    AS id_supervisor,
        u.nombres       AS supervisor_nombres,
        u.apellidos     AS supervisor_apellidos
      FROM area a
      JOIN obra o 
        ON a.id_obra = o.id_obra
      LEFT JOIN usuario u 
        ON a.id_usuario = u.id_usuario
      WHERE a.id_obra = ?
      ORDER BY a.id_area
    `,
      [id_obra]
    );
    return rows;
  } finally {
    c.release();
  }
}

/**
 * Crea un área (incluyendo el supervisor con id_usuario).
 */
async function create({ id_obra, nombre, descripcion, id_usuario }) {
  const c = await pool.getConnection();
  try {
    const [res] = await c.query(
      `
      INSERT INTO area 
        (id_obra, nombre, descripcion, id_usuario)
      VALUES (?, ?, ?, ?)
    `,
      [id_obra, nombre, descripcion, id_usuario]
    );
    return res.insertId;
  } finally {
    c.release();
  }
}

/**
 * Actualiza un área (puede cambiar incluso el supervisor).
 */
async function updateById(id_area, { nombre, descripcion, id_usuario }) {
  const c = await pool.getConnection();
  try {
    const [res] = await c.query(
      `
      UPDATE area
         SET nombre      = ?,
             descripcion = ?,
             id_usuario  = ?
       WHERE id_area = ?
    `,
      [nombre, descripcion, id_usuario, id_area]
    );
    return res.affectedRows;
  } finally {
    c.release();
  }
}

/**
 * Borra un área por su ID.
 */
async function deleteById(id_area) {
  const c = await pool.getConnection();
  try {
    const [res] = await c.query(`DELETE FROM area WHERE id_area = ?`, [
      id_area,
    ]);
    return res.affectedRows;
  } finally {
    c.release();
  }
}

/**
 * Devuelve la única área asignada a un supervisor
 * dentro de una obra concreta.
 */
async function findAreaAsignadaPorUsuario(id_usuario, id_obra) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        a.id_area,
        a.nombre,
        a.descripcion,
        a.id_obra,
        a.id_usuario    AS id_supervisor,
        u.nombres       AS supervisor_nombres,
        u.apellidos     AS supervisor_apellidos
      FROM area a
      JOIN usuario u 
        ON a.id_usuario = u.id_usuario
      WHERE a.id_obra   = ?
        AND a.id_usuario = ?
      LIMIT 1
      `,
      [id_obra, id_usuario]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

module.exports = {
  findAll,
  findById,
  findByObraId,
  create,
  updateById,
  deleteById,
  findAreaAsignadaPorUsuario,
};
