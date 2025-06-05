//src/routes/reporte.routes.js
const router = require('express').Router();
const ReporteController = require('../controllers/reporte.controller');
const { verificarRol } = require('../middlewares/verificarrol.middleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken); // Verifica token en todas las rutas

// Listar y ver detalles (roles supervisor/coordinador)
router.get('/', ReporteController.getAllReportes);
router.get('/:id', ReporteController.getReporteById);

// Crear reporte (coordinador)
router.post('/', upload.single('imagen'), ReporteController.createReporte);
router.put(
  '/:id',
  upload.single('imagen'), // permite actualizar imagen
  ReporteController.updateReporte
);
router.patch('/:id/estado', ReporteController.updateEstadoReporte);
router.get('/area/:id', ReporteController.getReportesByArea);
router.get('/obra/:id', ReporteController.getReportesByObra);
router.get('/usuario/:id_usuario', ReporteController.getReportesByUsuario);
router.get('/obras-coordinador/:id_coordinador', ReporteController.getReportesByCoordinador);
router.delete('/:id', ReporteController.deleteReporte);
router.post(
  '/detect-infracciones',
  upload.single('imagen'),
  ReporteController.detectInfracciones
);

module.exports = router;
