// src/controllers/obraUsuario.controller.js
const obraUsuarioService = require('../services/obraUsuario.service');

async function getSupervisors(req, res, next) {
  try {
    const { obraId } = req.params;
    const list = await obraUsuarioService.getSupervisorsOfObra(+obraId);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function assignSupervisor(req, res, next) {
  try {
    const { obraId, usuario } = req.body;
    await obraUsuarioService.assignSupervisorToObra({ obraId: +obraId, usuario });
    res.status(201).json({ message: 'Supervisor asignado' });
  } catch (err) {
    next(err);
  }
}

async function removeSupervisor(req, res, next) {
  try {
    const { obraId, supervisorId } = req.body;
    await obraUsuarioService.removeSupervisorFromObra(+obraId, +supervisorId);
    res.json({ message: 'Supervisor removido' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSupervisors, assignSupervisor, removeSupervisor };
