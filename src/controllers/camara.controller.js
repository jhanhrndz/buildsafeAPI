//src/controllers/camara.controller.js
const CamaraService = require("../services/camara.service");

const getAllCamaras = async (req, res, next) => {
  try {
    const camaras = await CamaraService.getAllCamaras();
    res.json(camaras);
  } catch (err) {
    next(err);
  }
};

const getActiveByArea = async (req, res, next) => {
  try {
    const id_area = req.params.id;
    if (isNaN(id_area)) return res.status(400).json({ message: "ID inválido" });

    const cams = await CamaraService.getActiveByArea(id_area);
    res.json(cams);
  } catch (err) {
    next(err);
  }
};

const getActiveBySupervisor = async (req, res, next) => {
  try {
    const id_usuario = parseInt(req.params.id);
    if (isNaN(id_usuario))
      return res.status(400).json({ message: "ID inválido" });

    const cameras = await CamaraService.getActiveBySupervisor(id_usuario);
    res.json(cameras);
  } catch (err) {
    next(err);
  }
};

const getByArea = async (req, res, next) => {
  try {
    const id_area = parseInt(req.params.id);
    if (isNaN(id_area)) {
      return res.status(400).json({ message: "ID de área inválido" });
    }

    const camaras = await CamaraService.getByArea(id_area);
    res.json(camaras);
  } catch (err) {
    next(err);
  }
};

const getAllActive = async (req, res, next) => {
  try {
    const camaras = await CamaraService.getAllActive();
    res.json(camaras);
  } catch (err) {
    next(err);
  }
};

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

    // Obtener cámara creada para respuesta completa
    const nuevaCamara = await CamaraService.getCamaraById(id);

    res.status(201).json({
      message: "Cámara creada exitosamente",
      camara: nuevaCamara,
    });
  } catch (err) {
    next(err);
  }
};
const updateCamara = async (req, res, next) => {
  try {
    await CamaraService.updateCamara(req.params.id, req.body);
    res.json({ message: "Cámara actualizada" });
  } catch (err) {
    next(err);
  }
};

const deleteCamara = async (req, res, next) => {
  try {
    await CamaraService.deleteCamara(req.params.id);
    res.json({ message: "Cámara eliminada" });
  } catch (err) {
    next(err);
  }
};

const updateLastConnection = async (req, res, next) => {
  try {
    await CamaraService.updateLastConnection(req.params.id);
    res.json({ message: "Última conexión actualizada" });
  } catch (err) {
    next(err);
  }
};

const getByObra = async (req, res, next) => {
  try {
    const id_obra = parseInt(req.params.id_obra);
    if (isNaN(id_obra)) {
      return res.status(400).json({ message: "ID de obra inválido" });
    }

    const camaras = await CamaraService.getByObra(id_obra);
    res.json(camaras);
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
  getAllActive,
  getActiveByArea,
  getActiveBySupervisor,
  getByArea,
  getByObra
};
