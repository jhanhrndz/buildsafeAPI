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

async function getAreasByObra(id_obra) {
  const areas = await model.findByObraId(id_obra);
  if (!areas) throw { status: 404, message: 'Áreas no encontradas para la obra' };
  return areas;
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



async function getAreasByObra(id_obra) {
  const areas = await model.findByObraId(id_obra);
  if (!areas) throw { status: 404, message: 'Áreas no encontradas para la obra' };
  return areas;
}
async function getAreaAsignadaPorUsuario(id_usuario, id_obra) {
  const area = await model.findAreaAsignadaPorUsuario(id_usuario, id_obra);
  if (!area) throw { status: 404, message: 'Área no encontrada' };
  return area;
}

module.exports = { getAllAreas, getAreaById, createArea, updateArea, deleteArea, getAreasByObra };
