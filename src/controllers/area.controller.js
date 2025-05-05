// src/controllers/area.controller.js
const service = require('../services/area.service');

async function getAllAreas(req, res, next) {
  try {
    const areas = await service.getAllAreas();
    res.json(areas);
  } catch (err) {
    next(err);
  }
}

async function getAreaById(req, res, next) {
  try {
    const area = await service.getAreaById(req.params.id);
    res.json(area);
  } catch (err) {
    next(err);
  }
}

async function createArea(req, res, next) {
  try {
    const id = await service.createArea(req.body);
    res.status(201).json({ id_area: id });
  } catch (err) {
    next(err);
  }
}

async function updateArea(req, res, next) {
  try {
    await service.updateArea(req.params.id, req.body);
    res.json({ message: 'Área actualizada' });
  } catch (err) {
    next(err);
  }
}

async function deleteArea(req, res, next) {
  try {
    await service.deleteArea(req.params.id);
    res.json({ message: 'Área eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllAreas, getAreaById, createArea, updateArea, deleteArea };
