// src/routes/stream.routes.js
const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const { pythonUrl } = require('../config'); // e.g. "http://localhost:5000"

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
      '^/area': '/api/area',  // <–– reescribimos /area → /api/area
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
      '^/video_feed': '/api/video_feed',  // <–– reescribimos /video_feed → /api/video_feed
    },
    ws: false,
  })
);

module.exports = router;
