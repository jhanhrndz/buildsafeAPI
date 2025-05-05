// src/routes/notificacion.routes.js
const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken);

// GET /notifications
router.get('/', notifController.getNotifications);

// POST /notifications/mark-read
router.post('/mark-read', notifController.markRead);

module.exports = router;
