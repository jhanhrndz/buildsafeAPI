const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usuarioModel = require("../models/usuario.model");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registro local
async function registerLocal({
  usuario,
  contrasena,
  documento,
  nombres,
  apellidos,
  correo,
  telefono,
  global_role,
}) {
  const exists = await usuarioModel.findByUsername(usuario);
  if (exists) throw { status: 409, message: "Usuario ya existe" };
  const hash = await bcrypt.hash(contrasena, 10);
  const id = await usuarioModel.createLocal({
    usuario,
    hash,
    documento,
    nombres,
    apellidos,
    correo,
    telefono,
    global_role,
  });
  return id;
}

// Login local
async function loginLocal(usuario, contrasena) {
  const user = await usuarioModel.findByUsername(usuario);
  if (!user) throw { status: 401, message: "Credenciales inválidas" };
  const ok = await bcrypt.compare(contrasena, user.contrasena_hashed);
  if (!ok) throw { status: 401, message: "Credenciales inválidas" };
  const payload = { id: user.id_usuario, role: user.global_role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
  return { token, user: payload };
}

// Login Google
async function loginWithGoogle(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { sub: googleId, email, given_name, family_name } = ticket.getPayload();

  let user = await usuarioModel.findByGoogleId(googleId);
  if (!user) {
    user = await usuarioModel.findByEmail(email);
    if (user) {
      await usuarioModel.updateGoogleId(user.id_usuario, googleId);
    }
  }
  if (!user) {
    const newId = await usuarioModel.createGoogle({
      usuario: email,
      documento: "",
      nombres: given_name,
      apellidos: family_name,
      correo: email,
      googleId,
      global_role: "coordinador", // o 'supervisor'
    });
    user = { id_usuario: newId, global_role: "coordinador" };
  }
  const payload = { id: user.id_usuario, role: user.global_role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
  return { token, user: payload };
}

module.exports = { registerLocal, loginLocal, loginWithGoogle };
