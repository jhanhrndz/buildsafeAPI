// src/routes/area.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/area.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verificarRol }      = require('../middlewares/verificarrol.middleware');

// 1) Aplica JWT a todas las rutas de área
router.use(authenticateToken);

// 2) Listar/Ver áreas → coordinador o supervisor (cualquiera autenticado)
router.get('/', ctrl.getAllAreas);
router.get('/:id', ctrl.getAreaById);

// 3) Crear/Editar/Borrar → sólo coordinador global
router.post('/',  verificarRol(['coordinador']), ctrl.createArea);
router.put('/:id', verificarRol(['coordinador']), ctrl.updateArea);
router.delete('/:id',  verificarRol(['coordinador']), ctrl.deleteArea);

module.exports = router;
