// src/controllers/infraccionEpp.controller.js
const service = require('../services/infraccionEpp.service');

async function getAll(req, res, next) {
  try {
    const arr = await service.getAllInfracciones();
    res.json(arr);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const inf = await service.getInfraccionById(req.params.id);
    res.json(inf);
  } catch (err) {
    next(err);
  }
}

async function getByReporte(req, res, next) {
  try {
    const arr = await service.getByReporte(req.params.idReporte);
    res.json(arr);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const id = await service.createInfraccion(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    await service.updateInfraccion(req.params.id, req.body);
    res.json({ message: 'Infracción actualizada' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteInfraccion(req.params.id);
    res.json({ message: 'Infracción eliminada' });
  } catch (err) {
    next(err);
  }
}
async function getByArea(req, res, next) {
  try {
    const list = await InfraccionService.getInfraccionesByArea(req.params.idArea);
    res.json(list);
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getAll,
  getById,
  getByReporte,
  create,
  update,
  remove,
  getByArea
};
