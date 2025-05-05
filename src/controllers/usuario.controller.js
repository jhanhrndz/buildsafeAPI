const svc = require('../services/usuario.service');

async function list(req, res, next) {
  try {
    const users = await svc.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await svc.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    await svc.updateUser(req.params.id, req.body);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await svc.deleteUser(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
}
async function findAll(req, res, next) {
  try {
    const users = await svc.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, update, remove, findAll };
