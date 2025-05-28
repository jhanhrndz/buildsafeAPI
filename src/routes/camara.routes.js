//src/routes/camara.routes.js
const express = require('express');
const router = express.Router();

const CamaraController = require('../controllers/camara.controller');
const { verificarRol } = require('../middlewares/verificarrol.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');

//aun no terminado del todo
router.use(authenticateToken);

// 1. Listar todas las cámaras (coordinador y supervisor)
router.get('/', CamaraController.getAllCamaras);

router.get('/obra/:id_obra', CamaraController.getByObra);

// 2. Listar cámaras activas globales (coordinador y supervisor)
router.get('/activas', CamaraController.getAllActive);

// 3. Obtener cámaras activas por área (coordinador y supervisor)
router.get('/area/:id/activas', CamaraController.getActiveByArea);

// 4. Obtener todas las cámaras por área (coordinador y supervisor)
router.get('/area/:id/todas', CamaraController.getByArea);

// 5. Obtener cámaras activas por supervisor (coordinador y supervisor)
router.get('/supervisor/:id/activas', CamaraController.getActiveBySupervisor);

// 6. Obtener cámara por ID (coordinador y supervisor)
router.get('/:id', CamaraController.getCamaraById);


// 7. Crear cámara (SOLO coordinador)
router.post('/', 
  verificarRol('coordinador'),
  CamaraController.createCamara
);

// 8. Actualizar cámara (SOLO coordinador)
router.put('/:id', 
  verificarRol('coordinador'),
  CamaraController.updateCamara
);

// 9. Eliminar cámara (SOLO coordinador)
router.delete('/:id', 
  verificarRol('coordinador'),
  CamaraController.deleteCamara
);


module.exports = router;
