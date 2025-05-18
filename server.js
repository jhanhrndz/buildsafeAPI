// server.js
require('dotenv').config();             // Carga variables de .env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");

const apiRoutes = require('./src/routes/api.routes');

const app = express();

// 📦 Middlewares globales
app.use(cors(
  {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
));                        // Permitir CORS
app.use(express.json());                // Parsear JSON bodies
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded bodies
app.use(morgan('dev'));                 // Logs HTTP (opcional)

// Ruta raíz
app.get('/', (req, res) => {
  res.send('BuildSafe API v1 funcionando ✅');
});

// Rutas principales
app.use('/api', apiRoutes);


// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// Arrancar servidor
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/`);
});
