// src/config/index.js
require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
  },
  jwtSecret: process.env.JWT_SECRET,
  pythonUrl: process.env.PYTHON_URL || 'http://localhost:5000'
};
