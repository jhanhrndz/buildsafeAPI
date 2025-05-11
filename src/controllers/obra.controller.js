const svc = require("../services/obra.service");

async function list(req, res, next) {
  try {
    res.json(await svc.list());
  } catch (e) {
    next(e);
  }
}
async function get(req, res, next) {
  try {
    res.json(await svc.get(req.params.id));
  } catch (e) {
    next(e);
  }
}
async function create(req, res, next) {
  try {
    const id = await svc.create(req.body);
    res.status(201).json({ id });
  } catch (e) {
    next(e);
  }
}
async function update(req, res, next) {
  try {
    await svc.update(req.params.id, req.body);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
async function remove(req, res, next) {
  try {
    await svc.remove(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}

async function findByUsuario(req, res, next) {
  try {
    const obras = await svc.findByUsuario(req.params.id);
    res.json(obras);
  } catch (e) {
    next(e);
  }
}

module.exports = { list, get, create, update, remove, findByUsuario };
