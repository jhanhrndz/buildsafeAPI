// src/routes/stream.routes.js
const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const { pythonUrl } = require('../config'); // e.g. "http://localhost:5000"
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use((req, res, next) => {
  // Si viene ?token=... en la URL, ponlo en el header Authorization
  if (req.query.token) {
    req.headers['authorization'] = `Bearer ${req.query.token}`;
  }
  next();
});

router.use(authenticateToken); // Aseguramos que el usuario esté autenticado

// 1️Cámaras por área
// Cliente → GET /api/stream/area/:areaId/camaras
// Proxy → http://localhost:5000/api/area/:areaId/camaras
router.get(
  '/area/:areaId/camaras',
  createProxyMiddleware({
    target: pythonUrl,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/area': '/api/area',
    },
    onProxyReq: (proxyReq, req) => {
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        proxyReq.setHeader('authorization', authHeader);
      }
    },
  })
);

// Stream MJPEG de cámara
// Cliente → GET /api/stream/video_feed/:camId
// Proxy → http://localhost:5000/api/video_feed/:camId
router.get(
  '/video_feed/:camId',
  createProxyMiddleware({
    target: pythonUrl,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/video_feed': '/api/video_feed',
    },
    onProxyReq: (proxyReq, req) => {
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        proxyReq.setHeader('authorization', authHeader);
      }
    },
    ws: false,
  })
);

module.exports = router;
