// src/routes/categoriaEpp.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/categoriaEpp.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verificarRol }      = require('../middlewares/verificarrol.middleware');

// Todas requieren autenticación
//router.use(authenticateToken);

// Listar y ver (todos los roles autenticados)
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Crear/Actualizar/Eliminar (solo coordinador global)
router.post('/',  ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
