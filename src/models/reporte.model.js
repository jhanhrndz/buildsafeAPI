// src/models/reporte.model.js
const { pool } = require('../config/db'); // Importa el pool

async function findAll() {
  const db = await pool.getConnection();  // Obtiene una conexión del pool
  try {
    const [rows] = await db.query(`
      SELECT r.*,
             c.ip_stream        AS camara_ip_stream,
             a.nombre           AS nombre_area,
             o.nombre           AS nombre_obra,
             cat.nombre         AS categoria_epp
      FROM reporte r
      JOIN camara c    ON r.id_camara = c.id_camara
      JOIN area a      ON r.id_area = a.id_area
      JOIN obra o      ON a.id_obra = o.id_obra
      LEFT JOIN infraccion_epp iepp ON r.id_reporte = iepp.id_reporte
      LEFT JOIN categoria_epp cat   ON iepp.id_epp = cat.id_epp
    `);
    return rows;
  } finally {
    db.release();  // Libera la conexión del pool
  }
}

async function findById(id) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT 
        r.*,
        c.ip_stream        AS camara_ip_stream,
        c.nombre           AS camara_nombre,
        a.nombre           AS nombre_area,
        o.nombre           AS nombre_obra,
        u.id_usuario       AS usuario_id,
        u.nombres          AS usuario_nombres,
        u.apellidos        AS usuario_apellidos,
        u.correo           AS usuario_correo,
        u.documento        AS usuario_documento,
        u.telefono         AS usuario_telefono
      FROM reporte r
      LEFT JOIN camara c  ON r.id_camara = c.id_camara
      JOIN area a         ON r.id_area = a.id_area
      JOIN obra o         ON a.id_obra = o.id_obra
      JOIN usuario u      ON r.id_usuario = u.id_usuario
      WHERE r.id_reporte = ?
    `, [id]);
    if (!rows.length) return null;

    // Obtener infracciones asociadas
    const [infracciones] = await db.query(`
      SELECT iepp.id_epp, iepp.nombre, cat.nombre AS categoria_epp
      FROM infraccion_epp iepp
      JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
      WHERE iepp.id_reporte = ?
    `, [id]);

    // Crear objeto usuario
    const usuario = {
      id: rows[0].usuario_id,
      nombres: rows[0].usuario_nombres,
      apellidos: rows[0].usuario_apellidos,
      correo: rows[0].usuario_correo,
      documento: rows[0].usuario_documento,
      telefono: rows[0].usuario_telefono
    };

    // Eliminar campos temporales
    delete rows[0].usuario_id;
    delete rows[0].usuario_nombres;
    delete rows[0].usuario_apellidos;
    delete rows[0].usuario_correo;
    delete rows[0].usuario_documento;
    delete rows[0].usuario_telefono;

    return { ...rows[0], infracciones, usuario };
  } finally {
    db.release();
  }
}

async function insertReporte({ id_area, id_camara, id_usuario, descripcion, estado, imagen_url }, connection = null) {
  const db = connection || await pool.getConnection();
  try {
    const [res] = await db.query(`
      INSERT INTO reporte (id_area, id_camara, id_usuario, descripcion, estado, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id_area, id_camara, id_usuario, descripcion, estado, imagen_url]);
    return res.insertId;
  } finally {
    if (!connection) db.release();
  }
}

async function insertInfraccion({ id_reporte, id_epp, nombre }, connection = null) {
  const db = connection || await pool.getConnection();
  try {
    await db.query(`
      INSERT INTO infraccion_epp (id_reporte, id_epp, nombre)
      VALUES (?, ?, ?)
    `, [id_reporte, id_epp, nombre]);
  } finally {
    if (!connection) db.release();
  }
}

async function findByArea(idArea) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id_reporte, 
        r.descripcion, 
        r.estado, 
        r.fecha_hora,
        r.imagen_url,
        r.id_area,
        a.nombre AS nombre_area,
        a.id_obra,
        o.nombre AS nombre_obra,
        r.id_usuario,
        u.nombres AS usuario_nombres,
        u.apellidos AS usuario_apellidos,
        u.correo AS usuario_correo,
        r.id_camara,
        c.nombre AS camara_nombre,
        c.ip_stream AS camara_ip_stream,
        GROUP_CONCAT(DISTINCT ce.nombre) AS categorias_epp
      FROM reporte r
      LEFT JOIN infraccion_epp ie ON r.id_reporte = ie.id_reporte
      LEFT JOIN categoria_epp ce ON ie.id_epp = ce.id_epp
      JOIN area a ON r.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      JOIN usuario u ON r.id_usuario = u.id_usuario  -- Nueva unión (comentario SQL válido)
      LEFT JOIN camara c ON r.id_camara = c.id_camara
      WHERE r.id_area = ?
      GROUP BY r.id_reporte
      ORDER BY r.fecha_hora DESC
    `, [idArea]);

    return rows.map(row => {
      const categorias = row.categorias_epp ? row.categorias_epp.split(',') : [];
      
      const usuario = {
        id: row.id_usuario,
        nombres: row.usuario_nombres,
        apellidos: row.usuario_apellidos,
        correo: row.usuario_correo
      };
      
      delete row.usuario_nombres;
      delete row.usuario_apellidos;
      delete row.usuario_correo;
      
      return {
        ...row,
        categorias_epp: categorias,
        usuario
      };
    });
  } finally {
    db.release();
  }
}


async function getReportesConEPPByArea(idArea) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(
      `SELECT r.*, GROUP_CONCAT(ie.nombre) AS infracciones 
       FROM reporte r
       LEFT JOIN infraccion_epp ie ON r.id_reporte = ie.id_reporte
       WHERE r.id_area = ?
       GROUP BY r.id_reporte`,
      [idArea]
    );
    return rows;
  } finally {
    db.release();
  }
}

async function getByUsuario(id_usuario) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT 
        r.*,
        a.nombre AS nombre_area,
        o.nombre AS nombre_obra,
        u.id_usuario AS usuario_id,
        u.nombres AS usuario_nombres,
        u.apellidos AS usuario_apellidos,
        u.correo AS usuario_correo,
        u.documento AS usuario_documento,
        u.telefono AS usuario_telefono
      FROM reporte r
      JOIN area a ON r.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      JOIN usuario u ON r.id_usuario = u.id_usuario
      WHERE r.id_usuario = ?
      ORDER BY r.fecha_hora DESC
    `, [id_usuario]);

    return rows.map(row => {
      const usuario = {
        id: row.usuario_id,
        nombres: row.usuario_nombres,
        apellidos: row.usuario_apellidos,
        correo: row.usuario_correo,
        documento: row.usuario_documento,
        telefono: row.usuario_telefono
      };
      
      delete row.usuario_id;
      delete row.usuario_nombres;
      delete row.usuario_apellidos;
      delete row.usuario_correo;
      delete row.usuario_documento;
      delete row.usuario_telefono;
      
      return { ...row, usuario };
    });
  } finally {
    db.release();
  }
}

async function getByObra(id_obra) {
  const db = await pool.getConnection();
  try {
    const [reportes] = await db.query(`
      SELECT 
        r.*,
        c.ip_stream AS camara_ip_stream,
        c.nombre AS camara_nombre,
        a.nombre AS nombre_area,
        o.nombre AS nombre_obra,
        u.id_usuario AS usuario_id,
        u.nombres AS usuario_nombres,
        u.apellidos AS usuario_apellidos,
        u.correo AS usuario_correo,
        u.global_role AS usuario_global_role,
        GROUP_CONCAT(
          DISTINCT CONCAT(iepp.nombre, '::', cat.nombre)
          SEPARATOR '||'
        ) AS infracciones_data
      FROM reporte r
      LEFT JOIN camara c ON r.id_camara = c.id_camara
      JOIN area a ON r.id_area = a.id_area
      JOIN obra o ON a.id_obra = o.id_obra
      JOIN usuario u ON r.id_usuario = u.id_usuario  -- Comentario SQL válido
      LEFT JOIN infraccion_epp iepp ON r.id_reporte = iepp.id_reporte
      LEFT JOIN categoria_epp cat ON iepp.id_epp = cat.id_epp
      WHERE o.id_obra = ?
      GROUP BY r.id_reporte
      ORDER BY r.fecha_hora DESC
    `, [id_obra]);

    return reportes.map(reporte => {
      const infracciones = reporte.infracciones_data 
        ? reporte.infracciones_data.split('||').map(inf => {
            const [nombre, categoria] = inf.split('::');
            return { nombre, categoria_epp: categoria };
          })
        : [];
      
      const usuario = {
        id: reporte.usuario_id,
        nombres: reporte.usuario_nombres,
        apellidos: reporte.usuario_apellidos,
        correo: reporte.usuario_correo,
        global_role: reporte.usuario_global_role
      };
      
      delete reporte.infracciones_data;
      delete reporte.usuario_id;
      delete reporte.usuario_nombres;
      delete reporte.usuario_apellidos;
      delete reporte.usuario_correo;
      delete reporte.usuario_global_role;
      
      return { ...reporte, infracciones, usuario };
    });
  } finally {
    db.release();
  }
}
async function getByCoordinador(id_coordinador) {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(`
      SELECT 
        r.*,
        c.ip_stream        AS camara_ip_stream,
        c.nombre           AS camara_nombre,
        a.nombre           AS nombre_area,
        o.nombre           AS nombre_obra,
        u.id_usuario       AS usuario_id,
        u.nombres          AS usuario_nombres,
        u.apellidos        AS usuario_apellidos,
        u.correo           AS usuario_correo,
        u.documento        AS usuario_documento,
        u.telefono         AS usuario_telefono
      FROM reporte r
      LEFT JOIN camara c  ON r.id_camara = c.id_camara
      JOIN area a         ON r.id_area = a.id_area
      JOIN obra o         ON a.id_obra = o.id_obra
      JOIN usuario u      ON r.id_usuario = u.id_usuario
      WHERE o.id_coordinador = ?
      ORDER BY r.fecha_hora DESC
    `, [id_coordinador]);

    return rows.map(row => {
      const usuario = {
        id: row.usuario_id,
        nombres: row.usuario_nombres,
        apellidos: row.usuario_apellidos,
        correo: row.usuario_correo,
        documento: row.usuario_documento,
        telefono: row.usuario_telefono
      };
      
      delete row.usuario_id;
      delete row.usuario_nombres;
      delete row.usuario_apellidos;
      delete row.usuario_correo;
      delete row.usuario_documento;
      delete row.usuario_telefono;
      
      return { ...row, usuario };
    });
  } finally {
    db.release();
  }
}

async function updateReporte(id, { descripcion, estado, imagen_url }) {
  const db = await pool.getConnection();
  try {
    const [result] = await db.query(`
      UPDATE reporte 
      SET 
        descripcion = ?,
        estado = ?,
        imagen_url = ?
      WHERE id_reporte = ?
    `, [descripcion, estado, imagen_url, id]);

    return result.affectedRows > 0;
  } finally {
    db.release();
  }
}

async function updateEstado(id, estado) {
  const db = await pool.getConnection();
  try {
    const [result] = await db.query(
      `UPDATE reporte SET estado = ? WHERE id_reporte = ?`,
      [estado, id]
    );
    return result.affectedRows > 0;
  } finally {
    db.release();
  }
}

async function deleteReporte(id) {
  const db = await pool.getConnection();
  try {
    // Primero eliminar infracciones relacionadas
    await db.query('DELETE FROM infraccion_epp WHERE id_reporte = ?', [id]);
    
    // Luego eliminar el reporte
    const [result] = await db.query('DELETE FROM reporte WHERE id_reporte = ?', [id]);
    
    return result.affectedRows > 0;
  } finally {
    db.release();
  }
}

module.exports = {
  findAll,
  findById,
  insertReporte,
  insertInfraccion,
  findByArea,
  getByObra,
  getByUsuario,
  getByCoordinador,
  updateReporte,
  deleteReporte,
  updateEstado
};
