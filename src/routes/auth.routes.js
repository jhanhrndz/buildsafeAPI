const router = require('express').Router();
const ctrl   = require('../controllers/auth.controller');

router.post('/register', ctrl.register);      // opcional si lo usas
router.post('/login',    ctrl.login);
router.post('/google',   ctrl.loginGoogle);

module.exports = router;
