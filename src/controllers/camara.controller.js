const CamaraService = require('../services/camara.service');

const getAllCamaras = async (req, res, next) => {
  try {
    const camaras = await CamaraService.getAllCamaras();
    res.json(camaras);
  } catch (err) {
    next(err);
  }
};

const getAllActive= async (req, res, next) => { 
  
    try {
      const camaras = await CamaraService.getAllActive();
      res.json(camaras);
    } catch (err) {
      next(err);
    }
  }

const getCamaraById = async (req, res, next) => {
  try {
    const camara = await CamaraService.getCamaraById(req.params.id);
    res.json(camara);
  } catch (err) {
    next(err);
  }
};

const createCamara = async (req, res, next) => {
  try {
    const id = await CamaraService.createCamara(req.body);
    res.status(201).json({ message: 'Cámara creada', id_camara: id });
  } catch (err) {
    next(err);
  }
};

const updateCamara = async (req, res, next) => {
  try {
    await CamaraService.updateCamara(req.params.id, req.body);
    res.json({ message: 'Cámara actualizada' });
  } catch (err) {
    next(err);
  }
};

const deleteCamara = async (req, res, next) => {
  try {
    await CamaraService.deleteCamara(req.params.id);
    res.json({ message: 'Cámara eliminada' });
  } catch (err) {
    next(err);
  }
};

const updateLastConnection = async (req, res, next) => {
  try {
    await CamaraService.updateLastConnection(req.params.id);
    res.json({ message: 'Última conexión actualizada' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCamaras,
  getCamaraById,
  createCamara,
  updateCamara,
  deleteCamara,
  updateLastConnection,
  getAllActive
};
