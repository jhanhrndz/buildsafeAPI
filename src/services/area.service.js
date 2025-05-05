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

module.exports = { getAllAreas, getAreaById, createArea, updateArea, deleteArea };
