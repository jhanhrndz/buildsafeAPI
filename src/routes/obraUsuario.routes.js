// src/routes/obraUsuario.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/obraUsuario.controller');
const { authenticateToken }      = require('../middlewares/auth.middleware');
const { verificarRol }           = require('../middlewares/verificarrol.middleware');

// Todas las rutas requieren token
router.use(authenticateToken);


router.get(
  '/obra/:obraId',
  verificarRol('coordinador'),  
  ctrl.getSupervisors
);

router.post(
  '/assign',
  verificarRol('coordinador'),
  ctrl.assignSupervisor
);

router.post(
  '/remove',
  verificarRol('coordinador'),
  ctrl.removeSupervisor
);

module.exports = router;
