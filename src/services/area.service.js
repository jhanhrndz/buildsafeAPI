// src/services/area.service.js
const model = require('../models/area.model');

async function getAllAreas() {
  return await model.findAll();
}

async function getAreaById(id) {
  const area = await model.findById(id);
  if (!area) throw { status: 404, message: 'Área no encontrada' };
  return area;
}

async function createArea(data) {
  // podrías validar que obra exista, supervisor exista, etc.
  return await model.create(data);
}

async function updateArea(id, data) {
  const affected = await model.updateById(id, data);
  if (affected === 0) throw { status: 404, message: 'Área no encontrada' };
}

async function deleteArea(id) {
  const affected = await model.deleteById(id);
  if (affected === 0) throw { status: 404, message: 'Área no encontrada' };
}

async function getAreaByCamera(id_camara) {
  const area = await model.getAreaByCamera(id_camara);
  if (!area) throw { status: 404, message: 'Área no encontrada para la cámara' };
  return area;
}

async function updateSupervisorArea(id_area, id_usuario) {
  // Validar que el usuario exista
  const user = await model.findById(id_usuario);
  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  // Validar que el área exista
  const area = await model.findById(id_area);
  if (!area) {
    throw { status: 404, message: "Área no encontrada" };
  }

  const affected = await model.updateSupervisorArea(id_area, id_usuario);
  if (affected === 0) {
    throw { status: 500, message: "Error al actualizar supervisor" };
  }
}
module.exports = { getAllAreas, getAreaById, createArea, updateArea, deleteArea, getAreaByCamera, updateSupervisorArea };
