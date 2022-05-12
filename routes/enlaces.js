const express = require('express');
const router = express.Router()
const enlacesController =  require('../controllers/enlacesController')
const archivosController=  require('../controllers/archivosController')

const auth = require('../middleware/auth')
const  {check} = require('express-validator')

router.post('/',
[
    check('nombre','sube un archivo').not().isEmpty(),
    check('nombre_original','sube un archivo').not().isEmpty(),
],
auth,
  enlacesController.nuevoEnlace
);

router.get('/', enlacesController.todosEnlaces)

router.get('/:url', 
     enlacesController.obtenerEnlace,

);

module.exports = router;