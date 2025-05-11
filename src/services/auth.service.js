const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const usuarioModel = require("../models/usuario.model");


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
  // crea y retorna el id
  const id = await usuarioModel.createLocal({
    usuario,
    hash: await bcrypt.hash(contrasena, 10),
    documento, nombres, apellidos, correo, telefono, global_role
  });
  return id;
}

// Login local
async function loginLocal(usuario, contrasena) {
  const user = await usuarioModel.findByUsername(usuario);
  if (!user) throw { status: 401, message: "Usuario no encontrado" };
  const ok = await bcrypt.compare(contrasena, user.contrasena_hashed);
  if (!ok) throw { status: 401, message: "Credenciales inválidas" };

  const payload = { id: user.id_usuario, role: user.global_role };
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

  // Devuelve también datos mínimos de usuario
  return { token, user: payload };
}


// Login con Firebase ID Token (Google/Firebase)
async function loginWithGoogle(firebaseToken) {
  const decoded = await admin.auth().verifyIdToken(firebaseToken);
  const { uid, email, name, picture } = decoded;

  // Buscar o crear usuario en MySQL
  let user = await usuarioModel.findByGoogleId(uid)
          || await usuarioModel.findByEmail(email);

  if (!user) {
    // Nuevo usuario
    const [primerNombre, ...resto] = name.split(" ");
    const nuevo = {
      usuario: email,
      documento: "",
      nombres: primerNombre,
      apellidos: resto.join(" "),
      correo: email,
      googleId: uid,
      global_role: "supervisor", // o 'coordinador' por defecto
    };
    const id_usuario = await usuarioModel.createGoogle(nuevo);
    user = await usuarioModel.findById(id_usuario);
  } else if (!user.google_id) {
    // Asocia google_id si vino por email
    await usuarioModel.updateGoogleId(user.id_usuario, uid);
  }

  const payload = { id: user.id_usuario, role: user.global_role };
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

  return {
    token,
    user: {
      id_usuario: user.id_usuario,
      usuario:     user.usuario,
      documento:   user.documento || "",
      nombres:     user.nombres,
      apellidos:   user.apellidos,
      correo:      user.correo,
      global_role: user.global_role,
      auth_provider: "google",
    }
  };
}

module.exports = { registerLocal, loginLocal, loginWithGoogle };
