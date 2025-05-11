require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Ajusta según necesidad
  queueLimit: 0
});

// Verifica la conexión al iniciar (opcional)
pool.getConnection()
  .then((connection) => {
    console.log('Conectado a MySQL como id', connection.threadId);
    connection.release();
  })
  .catch((err) => {
    console.error('Error de conexión:', err.message);
  });

module.exports = { pool };