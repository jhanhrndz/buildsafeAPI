// src/routes/area.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/area.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verificarRol }      = require('../middlewares/verificarrol.middleware');

//router.use(authenticateToken);
// Listar/Ver (coordinador o supervisor)
router.get('/', ctrl.getAllAreas);
router.get('/:id', ctrl.getAreaById);
// Crear/Editar/Borrar (solo coordinador global)
router.post('/',  ctrl.createArea);
router.put('/:id', ctrl.updateArea);
router.delete('/:id',  ctrl.deleteArea);

module.exports = router;
