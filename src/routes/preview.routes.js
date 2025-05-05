// src/routes/preview.routes.js
const router = require("express").Router();
const multer = require("multer");
const { preview } = require("../controllers/preview.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/verificarrol.middleware");

// Memoria, ya que solo reenviamos la imagen a Python
const upload = multer({ storage: multer.memoryStorage() });

router.post("/preview", upload.single("file"), preview);

module.exports = router;
