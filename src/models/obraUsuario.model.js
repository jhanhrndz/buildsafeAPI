const { pool } = require('../config/db');

/**
 * Lista todos los usuarios de una obra (coordinador, supervisores, invitados)
 */
async function findByObraId(obraId) {
  const c = await pool.getConnection();
  try {
    const [rows] = await c.query(
      `SELECT 
         ou.id_obra_usuario,
         ou.role,
         u.id_usuario,
         u.usuario,
         u.nombres,
         u.apellidos,
         u.correo
       FROM obra_usuario ou
       JOIN usuario u 
         ON ou.id_usuario = u.id_usuario
       WHERE ou.id_obra = ?`,
      [obraId]
    );
    return rows;
  } finally {
    c.release();
  }
}

/**
 * Asigna un supervisor a la obra.
 * Lanza 400 si ya existe esa tupla.
 */
async function assignSupervisor(obraId, usuarioId) {
  const c = await pool.getConnection();
  try {
    const [existing] = await c.query(
      `SELECT 1
         FROM obra_usuario
        WHERE id_obra  = ?
          AND id_usuario = ?
          AND role      = 'supervisor'`,
      [obraId, usuarioId]
    );
    if (existing.length) {
      throw { status: 400, message: 'Supervisor ya asignado a esta obra' };
    }
    const [res] = await c.query(
      `INSERT INTO obra_usuario
         (id_obra, id_usuario, role, accepted_at, created_at)
       VALUES (?, ?, 'supervisor', NOW(), NOW())`,
      [obraId, usuarioId]
    );
    return res.insertId;
  } finally {
    c.release();
  }
}

/**
 * Elimina la asignación de supervisor de la obra.
 */
async function deleteSupervisor(obraId, usuarioId) {
  const c = await pool.getConnection();
  try {
    const [res] = await c.query(
      `DELETE FROM obra_usuario
        WHERE id_obra   = ?
          AND id_usuario = ?
          AND role      = 'supervisor'`,
      [obraId, usuarioId]
    );
    return res.affectedRows;
  } finally {
    c.release();
  }
}

/**
 * Lista todos los supervisores de una obra
 * junto con sus áreas (campo area.id_usuario).
 */
async function findSupervisorsWithAreas(obraId) {
  const c = await pool.getConnection();
  try {
    const [rows] = await c.query(
      `
      SELECT
        u.id_usuario,
        u.nombres,
        u.apellidos,
        u.correo,
        COALESCE(
          CONCAT(
            '[',
            GROUP_CONCAT(
              DISTINCT
              CONCAT(
                '{"id_area":', a.id_area, ', "nombre_area":"', REPLACE(a.nombre, '"', '\\"'), '"}'
              )
              ORDER BY a.id_area
              SEPARATOR ','
            ),
            ']'
          ),
          '[]'
        ) AS areas
      FROM obra_usuario ou
      JOIN usuario u
        ON ou.id_usuario = u.id_usuario
      LEFT JOIN area a
        ON a.id_obra   = ou.id_obra
       AND a.id_usuario = u.id_usuario
      WHERE ou.id_obra = ?
        AND ou.role = 'supervisor'
      GROUP BY u.id_usuario, u.nombres, u.apellidos, u.correo
      `,
      [obraId]
    );
    // Convertir el string JSON a objeto JavaScript
    const parsedRows = rows.map(row => ({
      ...row,
      areas: JSON.parse(row.areas)
    }));
    return parsedRows;
  } finally {
    c.release();
  }
}

module.exports = {
  findByObraId,
  assignSupervisor,
  deleteSupervisor,
  findSupervisorsWithAreas
};
