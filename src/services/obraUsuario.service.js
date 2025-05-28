// src/services/obraUsuario.service.js
const obraUsuarioModel = require('../models/obraUsuario.model');
const usuarioService = require('./usuario.service');

async function getSupervisorsOfObra(obraId) {
  return obraUsuarioModel.findByObraId(obraId);
}


async function addSupervisorToObra(obraId, usuarioEmail) {
  // 1. Obtener usuario por email
  const usuario = await usuarioService.findByEmail(usuarioEmail);
  
  // 2. Validar que sea supervisor
  if (usuario.global_role !== 'supervisor') {
    throw { 
      status: 400, 
      message: 'El usuario no tiene rol de supervisor' 
    };
  }
  
  // 3. Asignar usando el ID del usuario
  return obraUsuarioModel.assignSupervisor(
    Number(obraId), 
    Number(usuario.id_usuario)
  );
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
