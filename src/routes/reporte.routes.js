//src/routes/reporte.routes.js
const router = require('express').Router();
const ReporteController = require('../controllers/reporte.controller');
const { verificarRol } = require('../middlewares/verificarrol.middleware');

//aun no terminado del todo
//api.routes importa este reporte.routes como /reportes/+ruta de aqui

// Listar y ver detalles (roles supervisor/coordinador)
router.get('/', ReporteController.getAllReportes);
router.get('/:id', ReporteController.getReporteById);

// Crear reporte (coordinador)
router.post('/', ReporteController.createReporte);
router.get('/area/:id', ReporteController.getReportesByArea);
router.get('/obra/:obraId', ReporteController.getReportesByObra);

module.exports = router;
