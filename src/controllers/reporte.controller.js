// src/controllers/reporte.controller.js
const service = require('../services/reporte.service');

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

async function createReporte(req, res, next) {
  try {
    // ID del usuario desde el JWT
    const id_usuario = req.user.id;
    const body = { ...req.body, id_usuario };
    const id_reporte = await service.createReporte(body);
    res.status(201).json({ id_reporte });
  } catch (err) {
    next(err);
  }
}


async function getReportesByArea(req, res, next) {
  try {
    const list = await ReporteService.getReportesByArea(req.params.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
}
module.exports = { getAllReportes, getReporteById, createReporte, getReportesByArea };
