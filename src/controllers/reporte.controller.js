// src/controllers/reporte.controller.js
const service = require('../services/reporte.service');
const areaService = require('../services/area.service');
const ReporteModel = require('../models/reporte.model');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const FormData = require('form-data');

async function getAllReportes(req, res, next) {
  try {
    const rows = await service.getAllReportes();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getReporteById(req, res, next) {
  try {
    const rpt = await service.getReporteById(req.params.id);
    res.json(rpt);
  } catch (err) {
    next(err);
  }
}

async function createReporte(req, res) {
  try {
    const { id_area, id_camara, id_usuario, descripcion, estado } = req.body;
    let imagen_url = null;
    let infracciones = [];

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'buildsafe/reportes' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imagen_url = result.secure_url;
    }

    if (req.body.infracciones) {
      infracciones = typeof req.body.infracciones === 'string'
        ? JSON.parse(req.body.infracciones)
        : req.body.infracciones;
    }

    const id = await service.createReporteCompleto({
      id_area,
      id_camara,
      id_usuario,
      descripcion,
      estado: estado || 'pendiente',
      imagen_url,
      infracciones
    });

    res.status(201).json({ id, imagen_url, infracciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
};

async function getReportesByArea(req, res, next) {
  try {
    const list = await ReporteService.getReportesByArea(req.params.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function getReportesByObra(req, res, next) {
  try {
    const list = await ReporteModel.getByObra(req.params.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function getReportesByUsuario(req, res, next) {
  try {
    const list = await ReporteModel.getByUsuario(req.params.id_usuario);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function getReportesByCoordinador(req, res, next) {
  try {
    const list = await ReporteModel.getByCoordinador(req.params.id_coordinador);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function updateReporte(req, res) {
  try {
    const { descripcion, estado } = req.body;
    let imagen_url = req.body.imagen_url;

    // Si viene nueva imagen, súbela a Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'buildsafe/reportes' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imagen_url = result.secure_url;
    }

    await service.updateReporte(req.params.id, { descripcion, estado, imagen_url });
    res.json({ message: 'Reporte actualizado' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error al actualizar reporte' });
  }
}

async function deleteReporte(req, res) {
  try {
    await service.deleteReporte(req.params.id);
    res.json({ message: 'Reporte eliminado' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Error al eliminar reporte' });
  }
}

async function detectInfracciones(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname });

    const pyRes = await axios.post(process.env.PYTHON_URL + '/detect', form, {
      headers: form.getHeaders(),
    });

    res.json({ infracciones: pyRes.data.infracciones || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error detectando infracciones' });
  }
}

module.exports = {
  getAllReportes,
  getReporteById,
  createReporte,
  getReportesByArea,
  getReportesByObra,
  getReportesByUsuario,
  getReportesByCoordinador,
  updateReporte,
  deleteReporte,
  detectInfracciones,
};
