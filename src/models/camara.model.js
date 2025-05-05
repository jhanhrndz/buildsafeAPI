const connectToDatabase = require('../config/db');

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

const create = async ({ id_area, ip_stream }) => {
  const db = await connectToDatabase();
  const [result] = await db.query(
    'INSERT INTO camara (id_area, ip_stream) VALUES (?, ?)',
    [id_area, ip_stream]
  );
  return result.insertId;
};


const updateById = async (id, { id_area, ip_stream }) => {
  const db = await connectToDatabase();
  const [result] = await db.query(
    'UPDATE camara SET id_area = ?, ip_stream = ? WHERE id_camara = ?',
    [id_area, ip_stream, id]
  );
  return result.affectedRows;
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
};
