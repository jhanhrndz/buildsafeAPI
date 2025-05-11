// src/controllers/reporte.controller.js
const service = require('../services/reporte.service');
const areaService = require('../services/area.service');
const ReporteModel = require('../models/reporte.model');

async function getAllReportes(req, res, next) {
  try {
    const rows = await service.getAllReportes();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getReporteById(req, res, next) {
  try {
    const rpt = await service.getReporteById(req.params.id);
    res.json(rpt);
  } catch (err) {
    next(err);
  }
}

const createReporte = async (req, res) => {
  try {
    const { id_camara, descripcion, imagen_url, infracciones } = req.body;
    
    // Obtener id_area automáticamente si es llamado por el servicio IA
    const id_area = req.user.role === 'servicio_ia' 
      ? await areaService.getAreaByCamera(id_camara)
      : req.body.id_area;

    if (!id_area) {
      return res.status(400).json({ error: 'Cámara no válida' });
    }

    const reporteId = await ReporteModel.insertReporte({
      id_area,
      id_camara,
      id_usuario: req.user.role === 'servicio_ia' ? null : req.user.id,
      descripcion,
      imagen_url
    });

    // Insertar infracciones asociadas
    for (const infraccion of infracciones) {
      await InfraccionEppModel.create({
        id_reporte: reporteId,
        id_epp: infraccion.id_epp,
        nombre: infraccion.nombre
      });
    }

    res.status(201).json({ id: reporteId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reporte' });
  }
};


async function getReportesByArea(req, res, next) {
  try {
    const list = await ReporteService.getReportesByArea(req.params.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function getReportesByObra(req, res, next) {
  try {
    const list = await ReporteModel.getByObra(req.params.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllReportes, getReporteById, createReporte, getReportesByArea, getReportesByObra };
