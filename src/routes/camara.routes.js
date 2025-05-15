const express = require('express');
const router = express.Router();

const CamaraController = require('../controllers/camara.controller');
const { verificarRol } = require('../middlewares/verificarrol.middleware');

// GET → Listar todas las cámaras (cualquiera autenticado)
router.get('/', CamaraController.getAllCamaras);

// Ruta nueva para cámaras activas por área
router.get('/area/:id/activas', CamaraController.getActiveByArea);

// Cámaras activas asignadas a un supervisor (por usuario)

// GET → Listar cámaras activas
router.get('/activas', CamaraController.getAllActive);

// GET → Obtener cámara por ID
router.get('/:id', CamaraController.getCamaraById);

// POST → Crear cámara (solo coordinador)
router.post('/', CamaraController.createCamara);

// PUT → Actualizar cámara (solo coordinador)
router.put('/:id',  CamaraController.updateCamara);

// DELETE → Eliminar cámara (solo coordinador)
router.delete('/:id', CamaraController.deleteCamara);

module.exports = router;
