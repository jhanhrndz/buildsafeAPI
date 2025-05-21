// src/controllers/area.controller.js
const service = require("../services/area.service");

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
    res.json({ message: "Área actualizada" });
  } catch (err) {
    next(err);
  }
}

async function deleteArea(req, res, next) {
  try {
    await service.deleteArea(req.params.id);
    res.json({ message: "Área eliminada" });
  } catch (err) {
    next(err);
  }
}

async function getAreasByObra(req, res, next) {
  try {
    const areas = await service.getAreasByObra(req.params.id_obra);
    res.json(areas);
  } catch (err) {
    next(err);
  }
}

async function getAreaAsignadaPorUsuario(req, res, next) {
  try {
    const id_obra = +req.params.id_obra;
    const id_usuario = +req.params.id_usuario;
    const area = await service.findAreaAsignadaPorUsuario(id_usuario, id_obra);
    if (!area) {
      return res
        .status(404)
        .json({
          error: "No hay área asignada para ese supervisor en esta obra",
        });
    }
    res.json(area);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
  getAreasByObra,
  getAreaAsignadaPorUsuario,
};
