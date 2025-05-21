// src/services/obraUsuario.service.js
const obraUsuarioModel = require('../models/obraUsuario.model');

async function getSupervisorsOfObra(obraId) {
  return obraUsuarioModel.findByObraId(obraId);
}


async function addSupervisorToObra(obraId, usuarioId) {
  return obraUsuarioModel.assignSupervisor(obraId, usuarioId);
}

async function removeSupervisorFromObra(obraId, usuarioId) {
  return obraUsuarioModel.deleteSupervisor(obraId, usuarioId);
}

async function getSupervisorsForObra(obraId) {
  return obraUsuarioModel.findSupervisorsWithAreas(obraId);
}

module.exports = {
  getSupervisorsOfObra,
  addSupervisorToObra,
  getSupervisorsForObra,
  removeSupervisorFromObra,
};
