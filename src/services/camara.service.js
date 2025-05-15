const CamaraModel = require('../models/camara.model');

const getAllCamaras = async () => {
  return await CamaraModel.getAll();
};

const getCamaraById = async (id) => {
  const camara = await CamaraModel.getById(id);
  if (!camara) throw { status: 404, message: 'Cámara no encontrada' };
  return camara;
};

const getAllActive = async () => {
  return await CamaraModel.getAllActive();
};

const getActiveByArea = async (id_area) => {
  const camaras = await CamaraModel.getActiveByArea(id_area);
  if (!camaras) throw { status: 404, message: 'Cámara no encontrada' };
  return camaras;
}

const getActiveBySupervisor = async (id_usuario) => {
  const camaras = await CamaraModel.getActiveBySupervisor(id_usuario);
  if (!camaras) throw { status: 404, message: 'Cámara no encontrada' };
  return camaras;
} 

const createCamara = async (data) => {
  // Aquí podrías validar que area exista, etc.
  const id = await CamaraModel.create(data);
  return id;
};

const updateCamara = async (id, data) => {
  const affected = await CamaraModel.updateById(id, data);
  if (affected === 0) throw { status: 404, message: 'Cámara no encontrada' };
};

const deleteCamara = async (id) => {
  const affected = await CamaraModel.deleteById(id);
  if (affected === 0) throw { status: 404, message: 'Cámara no encontrada' };
};

const updateLastConnection = async (id) => {
  const affected = await CamaraModel.updateLastConnection(id);
  if (affected === 0) throw { status: 404, message: 'Cámara no encontrada' };
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
  getActiveBySupervisor
};
