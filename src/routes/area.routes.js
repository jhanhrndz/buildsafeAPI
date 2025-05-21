const router = require("express").Router();
const ctrl = require("../controllers/area.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/verificarrol.middleware");

// Todas requieren token
//router.use(authenticateToken);

// Cualquiera autenticado (coordinador o supervisor) puede ver
router.get("/", ctrl.getAllAreas);
router.get("/:id", ctrl.getAreaById);
router.get("/obra/:id_obra", ctrl.getAreasByObra);
router.get(
  "/obra/:id_obra/supervisor/:id_usuario",
  ctrl.getAreaAsignadaPorUsuario
);
// Sólo coordinador global puede mutar
router.post("/", verificarRol("coordinador"), ctrl.createArea);
router.put("/:id", verificarRol("coordinador"), ctrl.updateArea);
router.delete("/:id", verificarRol("coordinador"), ctrl.deleteArea);

module.exports = router;
