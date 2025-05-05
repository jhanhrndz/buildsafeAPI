// src/services/obraUsuario.service.js
const obraUsuarioModel = require('../models/obraUsuario.model');

async function getSupervisorsOfObra(obraId) {
  return obraUsuarioModel.findByObraId(obraId);
}

async function assignSupervisorToObra({ obraId, usuario }) {
  // usuario puede ser username o email
  return obraUsuarioModel.insertSupervisor(obraId, usuario);
}

async function removeSupervisorFromObra(obraId, supervisorId) {
  return obraUsuarioModel.deleteSupervisor(obraId, supervisorId);
}

module.exports = {
  getSupervisorsOfObra,
  assignSupervisorToObra,
  removeSupervisorFromObra
};
