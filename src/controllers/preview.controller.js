// src/controllers/preview.controller.js
const PreviewService = require('../services/preview.service');

async function preview(req, res, next) {
  try {
    const infracciones = await PreviewService.analyzeImage(req.file);
    res.json({ infracciones });
  } catch (err) {
    next(err);
  }
}

module.exports = { preview };
