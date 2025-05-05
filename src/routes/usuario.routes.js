const router = require("express").Router();
const ctrl = require("../controllers/usuario.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/verificarrol.middleware");

//router.use(authenticateToken);

// Listar y ver (solo coordinador global)
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

// Actualizar/Eliminar (usuario puede actualizar su propia cuenta O coordinador global)
router.put(
  "/:id", ctrl.update
);

router.delete("/:id",ctrl.remove);

module.exports = router;
