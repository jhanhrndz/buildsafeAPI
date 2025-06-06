// src/services/reporte.service.js
const model = require('../models/reporte.model');
const CategoriaEppModel = require('../models/categoriaEpp.model');
const { pool } = require('../config/db');

async function getAllReportes() {
  return await model.findAll();
}

async function getReporteById(id) {
  return await model.findById(id); // Devuelve null si no existe
}

async function createReporte(data) {
  return await model.insertReporte(data);
}

async function getReportesByArea(idArea) {
  return await model.findByArea(idArea); // Siempre devuelve array (vacio o con datos)
}

async function getReportesByObra(idObra) {
  return await model.getByObra(idObra);
}

async function getReportesByUsuario(idUsuario) {
  return await model.findByUsuario(idUsuario); // Siempre devuelve array
}

async function getReportesByCoordinador(idCoordinador) {
  return await model.findByCoordinador(idCoordinador); // Siempre devuelve array
}

async function updateReporte(id, data) {
  return await model.updateReporte(id, data); // Devuelve false si no actualiza
}

async function deleteReporte(id) {
  return await model.deleteReporte(id); // Devuelve false si no elimina
}

async function createReporteCompleto({ id_area, id_camara, id_usuario, descripcion, estado, imagen_url, infracciones }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const id_reporte = await model.insertReporte(
      { id_area, id_camara, id_usuario, descripcion, estado, imagen_url },
      connection
    );

    for (const inf of infracciones) {
      let id_epp = inf.id_epp;
      if (!id_epp && inf.nombre) {
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

async function updateEstadoReporte(id, estado) {
  return await model.updateEstado(id, estado); // Devuelve false si no actualiza
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
  updateEstadoReporte,
};