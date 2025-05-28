//src/services/camara.service.js
const CamaraModel = require('../models/camara.model');
const areaService = require('./area.service'); // Asegúrate de que el servicio de área esté importado

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
  // Validar que el área exista (CRÍTICO para integridad referencial)
  try {
    const area = await areaService.getAreaById(data.id_area);
  } catch (error) {
    if (error.status === 404) {
      throw { status: 404, message: 'El área especificada no existe' };
    }
    throw error;
  }

  // Crear con valores por defecto
  const camaraData = {
    id_area: data.id_area,
    ip_stream: data.ip_stream || null, // Ahora acepta null
    nombre: data.nombre || 'Cámara sin nombre',
    estado: data.estado || 'activa'
  };

  return await CamaraModel.create(camaraData);
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

const getByArea = async (id_area) => {
  const camaras = await CamaraModel.getByArea(id_area);
  if (!camaras.length) {
    throw { status: 404, message: 'No se encontraron cámaras en esta área' };
  }
  return camaras;
};

const getByObra = async (id_obra) => {
  const camaras = await CamaraModel.getByObra(id_obra);
  if (!camaras.length) {
    throw { status: 404, message: 'No se encontraron cámaras en esta obra' };
  }
  return camaras;
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
