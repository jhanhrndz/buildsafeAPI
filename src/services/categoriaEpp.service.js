// src/services/categoriaEpp.service.js
const model = require('../models/categoriaEpp.model');

async function getAllCategorias() {
  return await model.findAll();
}

async function getCategoriaById(id) {
  const cat = await model.findById(id);
  if (!cat) throw { status: 404, message: 'Categoría no encontrada' };
  return cat;
}

async function createCategoria(data) {
  return await model.create(data);
}

async function updateCategoria(id, data) {
  const affected = await model.updateById(id, data);
  if (affected === 0) throw { status: 404, message: 'Categoría no encontrada' };
}

async function deleteCategoria(id) {
  const affected = await model.deleteById(id);
  if (affected === 0) throw { status: 404, message: 'Categoría no encontrada' };
}

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
