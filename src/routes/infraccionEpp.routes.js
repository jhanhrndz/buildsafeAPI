// src/routes/infraccionEpp.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/infraccionEpp.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verificarRol }      = require('../middlewares/verificarrol.middleware');

// Todas requieren autenticación
//router.use(authenticateToken);

// Listar/Ver (roles coordinador o supervisor)
router.get('/',  ctrl.getAll);
router.get('/:id', ctrl.getById);

// Listar por reporte
router.get('/reporte/:idReporte', ctrl.getByReporte);

// Crear/Editar/Borrar (solo coordinador)
router.post('/',  ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/area/:idArea', ctrl.getByArea);
module.exports = router;
