//src/services/usuario.service.js
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

async function findByEmail(email) {
  const user = await usuarioModel.findByEmail(email);
  if (!user) throw { status: 404, message: "Usuario no encontrado" };
  return user; // Devuelve TODO el objeto usuario
}

module.exports = { listUsers, getUserById, updateUser, deleteUser, findAll, findByEmail };
