require('dotenv').config();
const mysql = require('mysql2/promise');

let connection;

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Conectado a MySQL como id', connection.threadId);
    return connection;

  } catch (err) {
    console.error('Error de conexión: ' + err.message);
  }
}

module.exports = connectToDatabase;
