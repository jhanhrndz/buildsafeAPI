// src/controllers/categoriaEpp.controller.js
const service = require('../services/categoriaEpp.service');

async function getAll(req, res, next) {
  try {
    const cats = await service.getAllCategorias();
    res.json(cats);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const cat = await service.getCategoriaById(req.params.id);
    res.json(cat);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const id = await service.createCategoria(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    await service.updateCategoria(req.params.id, req.body);
    res.json({ message: 'Categoría actualizada' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteCategoria(req.params.id);
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
