//src/services/preview.service.js
const PreviewModel = require('../models/preview.model');

async function analyzeImage(file) {
  if (!file) throw { status: 400, message: 'No se subió ningún archivo' };
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (!['jpg','jpeg','png'].includes(ext)) {
    throw { status: 400, message: 'Formato no soportado' };
  }
  const infracciones = await PreviewModel.detectImage(file.buffer, file.originalname);
  return infracciones;
}

module.exports = { analyzeImage };
