//src/routes/obra.routes.js
const r = require('express').Router();
const ctrl = require('../controllers/obra.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/verificarrol.middleware');

// 1) Aplica primero el JWT a **todas** las rutas de obra


// 2) Rutas de solo lectura (cualquier usuario autenticado)
r.get('/', ctrl.list);    
r.get('/mis-obras', ctrl.getObrasByUsuario)                        // SELECT * FROM obra
r.get('/:id', ctrl.get);                          // SELECT * FROM obra WHERE id_obra = :id
r.get('/usuario/:id', ctrl.findByUsuario); // SELECT * FROM obra WHERE id_coordinador = :id

r.get('/:id_obra/usuarios', ctrl.getUsuariosByObraId); // SELECT * FROM obra WHERE id_obra = :id_obra


// 3) Rutas de escritura (solo coordinador global)
r.post('/', verificarRol(['coordinador']), ctrl.create); // INSERT INTO obra ...
r.put('/:id', verificarRol(['coordinador']), ctrl.update); // UPDATE obra SET ... WHERE id_obra = :id
r.delete('/:id', verificarRol(['coordinador']), ctrl.remove); // DELETE FROM obra WHERE id_obra = :id

module.exports = r;
