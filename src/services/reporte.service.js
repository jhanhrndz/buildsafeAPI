// src/services/reporte.service.js
const model = require('../models/reporte.model');

async function getAllReportes() {
  return await model.findAll();
}

async function getReporteById(id) {
  const rpt = await model.findById(id);
  if (!rpt) throw { status: 404, message: 'Reporte no encontrado' };
  return rpt;
}

async function createReporte(data) {
  // data debe incluir: id_area, id_camara, id_usuario, descripcion, estado, imagen_url, id_epp, nombre_infraccion
  const id_reporte = await model.insertReporte(data);
  await model.insertInfraccion({
    id_reporte,
    id_epp: data.id_epp,
    nombre: data.nombre_infraccion
  });
  return id_reporte;
}
async function getReportesByArea(idArea) {
  const list = await model.findByArea(idArea);
  if (!list.length) throw { status: 404, message: 'No hay reportes en esa área' };
  return list;
}

async function getReportesByObra(idObra) {
  const list = await model.getByObra(idObra);
  if (!list.length) throw { status: 404, message: 'No hay reportes en esa obra' };
  return list;
}

module.exports = { getAllReportes, getReporteById, createReporte, getReportesByArea, getReportesByObra };
