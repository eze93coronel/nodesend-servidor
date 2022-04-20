const express = require('express');
const router = express.Router()
const authController =  require('../controllers/authController')
const auth = require('../middleware/auth')
const  {check} = require('express-validator')


router.post('/',
[
    check('email','agrega un email valido').isEmail(),
    check('password','del password no puede ir vacio').not().isEmpty(),

],

authController.autenticarUsuario);

router.get('/',
auth,
authController.usuarioAutenticado)

module.exports = router