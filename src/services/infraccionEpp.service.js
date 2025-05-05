// src/services/infraccionEpp.service.js
const model = require('../models/infraccionEpp.model');

async function getAllInfracciones() {
  return await model.findAll();
}

async function getInfraccionById(id) {
  const inf = await model.findById(id);
  if (!inf) throw { status: 404, message: 'Infracción no encontrada' };
  return inf;
}

async function getByReporte(idReporte) {
  return await model.findByReporteId(idReporte);
}

async function createInfraccion(data) {
  // data: { id_reporte, id_epp, nombre }
  return await model.create(data);
}

async function updateInfraccion(id, data) {
  const affected = await model.updateById(id, data);
  if (affected === 0) throw { status: 404, message: 'Infracción no encontrada' };
}

async function deleteInfraccion(id) {
  const affected = await model.deleteById(id);
  if (affected === 0) throw { status: 404, message: 'Infracción no encontrada' };
}
async function getInfraccionesByArea(idArea) {
  const list = await model.findByArea(idArea);
  if (!list.length) throw { status: 404, message: 'No hay infracciones en esa área' };
  return list;
}
module.exports = {
  getAllInfracciones,
  getInfraccionById,
  getByReporte,
  createInfraccion,
  updateInfraccion,
  deleteInfraccion,
  getInfraccionesByArea,
};
