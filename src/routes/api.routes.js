const express = require('express');
const router = express.Router();

// Middlewares
const { authenticateToken }      = require('../middlewares/auth.middleware');
const { verificarRol }           = require('../middlewares/verificarrol.middleware');
const errorHandler               = require('../middlewares/error.middleware');

// Rutas públicas
router.use('/auth', require('./auth.routes'));

// A partir de aquí todas requieren token

// CRUD principales
router.use('/obras',        require('./obra.routes'));
router.use('/areas',        require('./area.routes'));
router.use('/camaras',      require('./camara.routes'));
router.use('/reportes',     require('./reporte.routes'));
router.use('/usuarios',     require('./usuario.routes'));
router.use('/obraUsuarios', require('./obraUsuario.routes'));
router.use('/categoriaEpps',    require('./categroiaEpp.routes'));
router.use('/infraccionEpps',   require('./infraccionEpp.routes'));
router.use('/notifications',     require('./notification.routes'));

// Integración Python
router.use('/reportes/preview', require('./preview.routes')); //enviar archivo con reporte
router.use('/stream',            require('./stream.routes'));

// Manejo de errores
router.use(errorHandler);

module.exports = router;
