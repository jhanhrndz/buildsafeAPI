// src/services/obra.service.js
const model = require('../models/obra.model');

async function list() { 
  return await model.findAll(); 
}

async function get(id) {
  return await model.findById(id); // Retorna null si no existe
}

async function create(data) {
  return await model.create(data);
}

async function update(id, data) {
  const updated = await model.update(id, data);
  return updated; // Retorna false o 0 si no actualiza
}

async function remove(id) {
  const deleted = await model.remove(id);
  return deleted; // Retorna false o 0 si no elimina
}

async function findByUsuario(userId) {
  return await model.findByUsuario(userId); // Siempre retorna array
}

async function getUsuariosByObraId(obraId) {
  return await model.getUsuariosByObraId(obraId); // Siempre retorna array
}

async function getUsuariosByRol(obraId, rol) {
  return await model.getUsuariosByRol(obraId, rol); // Siempre retorna array
}

async function getObrasByUsuario(userId) {
  return await model.findObrasByUsuario(userId); // Siempre retorna array
}

module.exports = { 
  list, 
  get, 
  create, 
  update, 
  remove, 
  findByUsuario, 
  getUsuariosByObraId, 
  getUsuariosByRol, 
  getObrasByUsuario 
};