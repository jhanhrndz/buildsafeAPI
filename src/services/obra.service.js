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
async function getByCoordinador(id) {
  const o = await model.findByCoordinador(id);
  if (!o) throw { status: 404, message: 'Obra no encontrada' };
  return o;
}
module.exports = { list, get, create, update, remove, getByCoordinador };
