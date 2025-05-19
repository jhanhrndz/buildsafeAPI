const authService = require('../services/auth.service');
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const {
  registerLocal: svcRegister,
  loginLocal:    svcLogin,
  loginWithGoogle: svcGoogle
} = require("../services/auth.service"); // Lo ideal es separar lógica en servicios


// ---- Inicialización de Firebase Admin (sólo una vez) ----
const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
};
if (!admin.apps.length) admin.initializeApp(firebaseConfig);
// ---------------------------------------------------------


// Registro local
async function register(req, res, next) {
  try {
    const { token, user } = await svcRegister(req.body); // Cambiar aquí
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
async function login(req, res, next) {
  try {
    const { token, user } = await svcLogin(req.body.usuario, req.body.contrasena);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

// En loginGoogle
async function loginGoogle(req, res, next) {
  try {
    const { token: firebaseToken } = req.body; // Extrae el token del body
    const { token, user } = await authService.loginWithGoogle(firebaseToken);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  loginGoogle,
};
