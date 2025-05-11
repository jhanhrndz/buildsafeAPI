const express = require('express');
const router = express.Router();

const CamaraController = require('../controllers/camara.controller');
const { verificarRol } = require('../middlewares/verificarrol.middleware');

// GET → Listar todas las cámaras (cualquiera autenticado)
router.get('/', CamaraController.getAllCamaras);

// GET → Listar cámaras activas
router.get('/activas', CamaraController.getAllActive);

// GET → Obtener cámara por ID
router.get('/:id', CamaraController.getCamaraById);

// POST → Crear cámara (solo coordinador)
router.post('/', verificarRol(['coordinador']), CamaraController.createCamara);

// PUT → Actualizar cámara (solo coordinador)
router.put('/:id', verificarRol(['coordinador']), CamaraController.updateCamara);

// DELETE → Eliminar cámara (solo coordinador)
router.delete('/:id', verificarRol(['coordinador']), CamaraController.deleteCamara);

module.exports = router;
