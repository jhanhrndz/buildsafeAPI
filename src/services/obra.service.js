const model = require('../models/obra.model');

async function list() { return await model.findAll(); }
async function get(id) {
  const o = await model.findById(id);
  if (!o) throw { status: 404, message: 'Obra no encontrada' };
  return o;
}
async function create(data) {
  return await model.create(data);
}
async function update(id,data) {
  await model.update(id,data);
}
async function remove(id) {
  await model.remove(id);
}

async function findByUsuario(userId) {
  const obras = await model.findByUsuario(userId);
  if (!obras) throw { status: 404, message: 'Obras no encontradas' };
  return obras;
}

module.exports = { list, get, create, update, remove, findByUsuario };
