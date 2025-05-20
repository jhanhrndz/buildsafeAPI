//src/services/auth.service.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const usuarioModel = require("../models/usuario.model");
const { pool } = require("../config/db");

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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Crear usuario
    const id = await usuarioModel.createLocal({
      usuario,
      hash: await bcrypt.hash(contrasena, 10),
      documento, 
      nombres, 
      apellidos, 
      correo, 
      telefono, 
      global_role
    });

    // Obtener usuario completo
    const user = await usuarioModel.findById(id);

    // Generar JWT (igual que en login)
    const payload = { 
      id: user.id_usuario, 
      role: user.global_role,
      provider: "local" 
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    await connection.commit();

    return {
      token,
      user: {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        global_role: user.global_role,
        auth_provider: "local"
      }
    };
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Login local
async function loginLocal(usuario, contrasena) {
  const user = await usuarioModel.findByUsername(usuario);
  if (!user) throw { status: 401, message: "Usuario no encontrado" };
  const ok = await bcrypt.compare(contrasena, user.contrasena_hashed);
  if (!ok) throw { status: 401, message: "Credenciales inválidas" };

  const payload = user;
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

  // Devuelve también datos mínimos de usuario
  return { token, user: payload };
}

async function verifyFirebaseToken(firebaseToken) {
  // Validación crítica: asegura que el token sea una cadena no vacía
  if (!firebaseToken || typeof firebaseToken !== "string") {
    throw { 
      status: 400, 
      message: "Token no proporcionado o formato inválido" 
    };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    return decoded;
  } catch (error) {
    console.error("Error verificando token:", error.message);
    throw { 
      status: 401, 
      message: "Token de Firebase inválido o expirado",
      details: error.message 
    };
  }
}

// Login con Firebase ID Token (Google/Firebase)
async function loginWithGoogle(firebaseToken) {
  const decoded = await verifyFirebaseToken(firebaseToken);
  const { uid, email, name, picture } = decoded;

  // Validar campos esenciales
  if (!email || !uid) {
    throw { status: 400, message: "El token no contiene información válida" };
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Buscar usuario existente
    let user = await usuarioModel.findByGoogleId(uid);
    if (!user) {
      user = await usuarioModel.findByEmail(email);
    }

    // Caso: Usuario existe pero sin vinculación a Google
    if (user && !user.google_id) {
      const existingLocalUser = await usuarioModel.findByEmail(email);
      if (existingLocalUser) {
        throw { 
          status: 409, 
          message: "El correo ya está registrado con otro método de autenticación" 
        };
      }
      await usuarioModel.updateGoogleId(user.id_usuario, uid);
    }

    // Caso: Nuevo usuario
    if (!user) {
      const [primerNombre, ...resto] = name.split(" ") || ["Usuario", "Sin Nombre"];
      const nuevoUsuario = {
        usuario: email || `user_${uid.slice(0, 8)}`, // Fallback si no hay email
        documento: null, // No requerido para Google
        nombres: primerNombre,
        apellidos: resto.join(" ") || " ",
        correo: email,
        googleId: uid,
        global_role: "coordinador", // Rol por defecto configurable desde ENV
      };
      
      const idUsuario = await usuarioModel.createGoogle(nuevoUsuario);
      user = await usuarioModel.findById(idUsuario);
    }

    // Generar JWT
    const payload = { 
      id: user.id_usuario, 
      role: user.global_role,
      provider: "google" 
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "4h" } // Configurable
    );

    await connection.commit();
    
    return {
      token,
      user: {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        global_role: user.global_role,
        auth_provider: "google",
      }
    };
  } catch (error) {
    await connection.rollback();
    throw error; // Re-lanzar para manejar en el controlador
  } finally {
    connection.release();
  }
}

module.exports = { registerLocal, loginLocal, loginWithGoogle };
