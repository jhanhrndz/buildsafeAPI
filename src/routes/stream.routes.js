// src/routes/stream.routes.js
const router = require("express").Router();
const { createProxyMiddleware } = require("http-proxy-middleware");
const { pythonUrl } = require("../config");

router.use(
  "/:camId",
  createProxyMiddleware({
    target: pythonUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const camId = req.params.camId;
      return `/video_feed/${camId}`;
    },
    ws: false,
  })
);

module.exports = router;
