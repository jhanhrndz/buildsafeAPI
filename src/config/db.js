//src/config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Ajusta según necesidad
  queueLimit: 0,
  enableKeepAlive: true, // Mantiene la conexión activa
  keepAliveInitialDelay: 0, // Inicia keep-alive inmediatamente
  connectTimeout: 60000, // 60 segundos para conectar
  acquireTimeout: 60000, // 60 segundos para adquirir conexión
  idleTimeout: 60000, // Cierra conexiones inactivas después de 60s
  timezone: "local", // Asegura la zona horaria correcta
  charset: "utf8mb4", // Codificación correcta
});

// Verifica la conexión al iniciar (opcional)
pool
  .getConnection()
  .then((connection) => {
    console.log("Conectado a MySQL como id", connection.threadId);
    connection.release();
  })
  .catch((err) => {
    console.error("Error de conexión:", err.message);
  });

module.exports = { pool };
