// src/controllers/notificacion.controller.js
const notificacionService = require('../services/notification.service');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const list = await notificacionService.getNotificationsForUser(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const { ids } = req.body; // espera { ids: [1,2,3] }
    const count = await notificacionService.markRead(ids);
    res.json({ updated: count });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, markRead };
