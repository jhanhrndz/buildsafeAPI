const connectToDatabase = require('../config/db');

const getAllActive = async () => {
  const db = await connectToDatabase();
  const [rows] = await db.query(`
    SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
    FROM camara c
    JOIN area a ON c.id_area = a.id_area
    JOIN obra o ON a.id_obra = o.id_obra
    WHERE c.estado = 'activa'
  `);
  return rows;
};

const getAll = async () => {
  const db = await connectToDatabase();
  const [rows] = await db.query(`
    SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
    FROM camara c
    JOIN area a ON c.id_area = a.id_area
    JOIN obra o ON a.id_obra = o.id_obra
  `);
  return rows;
};

const getById = async (id) => {
  const db = await connectToDatabase();
  const [rows] = await db.query(`
    SELECT c.*, a.nombre AS nombre_area, o.nombre AS nombre_obra
    FROM camara c
    JOIN area a ON c.id_area = a.id_area
    JOIN obra o ON a.id_obra = o.id_obra
    WHERE c.id_camara = ?
  `, [id]);
  return rows[0];
};

// Cambio 1: Incluir nuevos campos en el INSERT
const create = async ({ id_area, ip_stream, nombre, estado }) => {
  const db = await connectToDatabase();
  const [result] = await db.query(
    `INSERT INTO camara 
       (id_area, ip_stream, nombre, estado) 
     VALUES (?, ?, ?, ?)`,
    [id_area, ip_stream, nombre, estado || 'activa'] // Valor por defecto para estado
  );
  return result.insertId;
};

// Cambio 2: Incluir nuevos campos en el UPDATE
const updateById = async (id, { id_area, ip_stream, nombre, estado }) => {
  const db = await connectToDatabase();
  const [result] = await db.query(
    `UPDATE camara 
       SET id_area = ?, 
           ip_stream = ?,
           nombre = ?,
           estado = ?
     WHERE id_camara = ?`,
    [id_area, ip_stream, nombre, estado, id]
  );
  return result.affectedRows;
};

// Función nueva: Actualizar última conexión
const updateLastConnection = async (id) => {
  const db = await connectToDatabase();
  await db.query(
    `UPDATE camara 
       SET ultima_conexion = NOW() 
     WHERE id_camara = ?`,
    [id]
  );
};

const deleteById = async (id) => {
  const db = await connectToDatabase();
  const [result] = await db.query(
    'DELETE FROM camara WHERE id_camara = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  updateLastConnection,
  getAllActive,
};