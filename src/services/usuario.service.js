const usuarioModel = require("../models/usuario.model");

/**
 * Listar todos los usuarios
 */
async function listUsers() {
  return await usuarioModel.findAll();
}

/**
 * Detalle de un usuario
 */
async function getUserById(id) {
  const u = await usuarioModel.findById(id);
  if (!u) throw { status: 404, message: "Usuario no encontrado" };
  return u;
}

/**
 * Actualizar datos (excepto contraseña)
 */
async function updateUser(id, data) {
  const affected = await usuarioModel.updateById(id, data);
  if (affected === 0) throw { status: 404, message: "Usuario no encontrado" };
}

/**
 * Eliminar usuario
 */
async function deleteUser(id) {
  const affected = await usuarioModel.deleteById(id);
  if (affected === 0) throw { status: 404, message: "Usuario no encontrado" };
}

async function findAll(){
  return await usuarioModel.findAll();
}

module.exports = { listUsers, getUserById, updateUser, deleteUser, findAll };
