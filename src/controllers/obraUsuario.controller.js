// src/controllers/obraUsuario.controller.js
const obraUsuarioService = require('../services/obraUsuario.service');

async function assignSupervisor(req, res, next) {
  try {
    const obraId = req.params.obraId; // <- Obtener de la URL
    const { email } = req.body; // <- Recibir email desde body

    await obraUsuarioService.addSupervisorToObra(obraId, email);
    res.status(201).json({ 
      message: 'Supervisor asignado correctamente' 
    });
    
  } catch (err) {
    next(err);
  }
}

async function unassignSupervisor(req, res, next) {
  try {
    
    const obraId = req.params.obraId;
    const usuarioId = req.params.usuarioId;
    const removed = await obraUsuarioService.removeSupervisorFromObra(+obraId, +usuarioId);
    res.json({ removed });
  } catch (err) {
    next(err);
  }
}

async function getSupervisors(req, res, next) {
  try {
    const { obraId } = req.params;
    const list = await obraUsuarioService.getSupervisorsForObra(+obraId);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

module.exports = { getSupervisors, assignSupervisor, unassignSupervisor };
