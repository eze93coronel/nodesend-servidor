const express = require('express');
const router = express.Router()
const usuarioController =  require('../controllers/usuariosController')
const  {check} = require('express-validator')


router.post('/',
   [
        check('nombre','erl nombrec es obligatorio').not().isEmpty(),
        check('email','erl nombrec es obligatorio').not().isEmpty(),
        check('password','es obligatorio minimo 6 caracteres').isLength({min :6})

   ],

     usuarioController.nuevoUsuario
);

module.exports = router; 