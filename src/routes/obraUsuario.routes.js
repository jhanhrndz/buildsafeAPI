// src/routes/obraUsuario.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/obraUsuario.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/verificarrol.middleware");

// Todas requieren autenticación
router.use(authenticateToken);

// 1. Asignar supervisor por EMAIL (POST)
router.post(
  "/obras/:obraId/supervisores",
  verificarRol("coordinador"),
  ctrl.assignSupervisor
);

// 2. Listar supervisores de obra (GET)
router.get(
  "/obras/:obraId/supervisores",
  ctrl.getSupervisors
);

// 3. Eliminar supervisor por id (DELETE)
router.delete(
  "/obras/:obraId/supervisores/:usuarioId",
  verificarRol("coordinador"),
  ctrl.unassignSupervisor
);

module.exports = router;