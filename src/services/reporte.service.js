// src/services/reporte.service.js
const model = require('../models/reporte.model');
const CategoriaEppModel = require('../models/categoriaEpp.model');
const { pool } = require('../config/db');

async function getAllReportes() {
  return await model.findAll();
}

async function getReporteById(id) {
  const rpt = await model.findById(id);
  if (!rpt) throw { status: 404, message: 'Reporte no encontrado' };
  return rpt;
}

async function createReporte(data) {
  // data: { id_area, id_camara, id_usuario, descripcion, estado, imagen_url }
  return await model.insertReporte(data);
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

async function getReportesByUsuario(idUsuario) {
  const list = await model.findByUsuario(idUsuario);
  if (!list.length) throw { status: 404, message: 'No hay reportes para este usuario' };
  return list;
}

async function getReportesByCoordinador(idCoordinador) {
  const list = await model.findByCoordinador(idCoordinador);
  if (!list.length) throw { status: 404, message: 'No hay reportes para este coordinador' };
  return list;
}

async function updateReporte(id, data) {
  // data: { descripcion, estado, imagen_url }
  const ok = await model.updateReporte(id, data);
  if (!ok) throw { status: 404, message: 'Reporte no encontrado' };
  return ok;
}

async function deleteReporte(id) {
  const ok = await model.deleteReporte(id);
  if (!ok) throw { status: 404, message: 'Reporte no encontrado' };
  return ok;
}

async function createReporteCompleto({ id_area, id_camara, id_usuario, descripcion, estado, imagen_url, infracciones }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Crear el reporte
    const id_reporte = await model.insertReporte(
      { id_area, id_camara, id_usuario, descripcion, estado, imagen_url },
      connection
    );

    // 2. Insertar infracciones
    for (const inf of infracciones) {
      let id_epp = inf.id_epp;
      if (!id_epp && inf.nombre) {
        // Busca el id_epp por nombre
        const cat = await CategoriaEppModel.findByName(inf.nombre, connection);
        id_epp = cat?.id || null;
      }
      await model.insertInfraccion(
        { id_reporte, id_epp, nombre: inf.nombre },
        connection
      );
    }

    await connection.commit();
    return id_reporte;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllReportes,
  getReporteById,
  createReporte,
  getReportesByArea,
  getReportesByObra,
  getReportesByUsuario,
  getReportesByCoordinador,
  updateReporte,
  deleteReporte,
  createReporteCompleto,
};
