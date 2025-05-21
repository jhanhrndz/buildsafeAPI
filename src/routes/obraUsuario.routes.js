// src/routes/obraUsuario.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/obraUsuario.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/verificarrol.middleware");

// Todas las rutas requieren token
//router.use(authenticateToken);
// 1) Asignar supervisor a la obra
// POST /api/obras/:obraId/supervisores/:usuarioId
router.get("/", ctrl.getSupervisors);

// Listar solo supervisores + sus áreas
router.get("/supervisores", ctrl.getSupervisors);

// Solo coordinador global puede asignar/quitar supervisores
router.post(
  "/supervisores",
  verificarRol("coordinador"),
  ctrl.assignSupervisor
);

router.delete("/supervisores/:usuarioId", ctrl.unassignSupervisor);

module.exports = router;
