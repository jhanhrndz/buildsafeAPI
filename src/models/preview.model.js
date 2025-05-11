// src/services/detectImage.js
const axios = require('axios');
const FormData = require('form-data');
const { pythonUrl } = require('../config');

async function detectImage(buffer, filename) {
  const form = new FormData();
  form.append('file', buffer, filename);

  try {
    const resp = await axios.post(
      `${pythonUrl}/detect`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 15000
      }
    );
    return resp.data.infracciones; // [{ clase, descripcion }, ...]
  } catch (error) {
    console.error('Error al detectar imagen:', error.message);
    throw new Error('No se pudo procesar la imagen con el servicio de detección.');
  }
}

module.exports = { detectImage };
