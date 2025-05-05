const axios = require('axios');
const FormData = require('form-data');
const { pythonUrl } = require('../config');

async function detectImage(buffer, filename) {
  const form = new FormData();
  form.append('file', buffer, filename);
  const resp = await axios.post(
    `${pythonUrl}/detect`,
    form,
    { headers: form.getHeaders(), timeout: 15000 }
  );
  return resp.data.infracciones;  // [{ clase, descripcion }, ...]
}

module.exports = { detectImage };
