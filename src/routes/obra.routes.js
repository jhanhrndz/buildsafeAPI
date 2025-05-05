const r = require('express').Router();
const ctrl = require('../controllers/obra.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/verificarrol.middleware');

// todas requieren token
//r.use(authenticateToken);  verificarRol('coordinador'),

// listar/obtener: cualquiera autenticado
r.get('/', ctrl.list);
r.get('/:id', ctrl.get);

// crear/editar/eliminar: solo coordinador global
r.post('/',  ctrl.create);
r.put('/:id', ctrl.update);
r.delete('/:id', ctrl.remove);
r.get('/coordinador/:id', ctrl.getByCoordinador);

module.exports = r;
