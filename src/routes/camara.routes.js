const express = require('express');
const router = express.Router();

const CamaraController = require('../controllers/camara.controller');
const { verificarRol } = require('../middlewares/verificarrol.middleware');

// Todas las rutas ya pasan por authenticateToken en api.routes.js

router.get('/', CamaraController.getAllCamaras);
router.get('/:id',  CamaraController.getCamaraById);
router.post('/', CamaraController.createCamara);
router.put('/:id', CamaraController.updateCamara);
router.delete('/:id', CamaraController.deleteCamara);

module.exports = router;
