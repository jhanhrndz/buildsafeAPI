const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const id = await authService.registerLocal(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { usuario, contrasena } = req.body;
    const result = await authService.loginLocal(usuario, contrasena);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function loginGoogle(req, res, next) {
  try {
    const { id_token } = req.body;
    const result = await authService.loginWithGoogle(id_token);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, loginGoogle };
