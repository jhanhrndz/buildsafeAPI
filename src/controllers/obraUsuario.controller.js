// src/controllers/obraUsuario.controller.js
const obraUsuarioService = require('../services/obraUsuario.service');

async function assignSupervisor(req, res, next) {
  try {
    const { obraId, usuarioId } = req.body;
    await obraUsuarioService.addSupervisorToObra(+obraId, +usuarioId);
    res.status(201).json({ message: 'Supervisor asignado' });
  } catch (err) {
    next(err);
  }
}


async function unassignSupervisor(req, res, next) {
  try {
    const { obraId, usuarioId } = req.body;
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
