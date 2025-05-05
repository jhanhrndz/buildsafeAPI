// src/services/notificacion.service.js
const notificacionModel = require('../models/notification.model');

async function getNotificationsForUser(userId) {
  // trae notificaciones dirigidas al usuario + generales de su(s) obra(s)
  return notificacionModel.findUnreadByUser(userId);
}

async function markRead(ids) {
  return notificacionModel.markAsRead(ids);
}

// (opcional) método para crear notificación desde otros servicios
async function notify({ obra_id, area_id = null, user_id = null, mensaje }) {
  return notificacionModel.insertNotification({ obra_id, area_id, user_id, mensaje });
}

module.exports = {
  getNotificationsForUser,
  markRead,
  notify
};
