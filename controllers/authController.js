const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'variables.env'})
const {validationResult} =  require('express-validator');

exports.autenticarUsuario = async (req,res,next)=>{
        // revisar si ahiaa errores en

        const errores =validationResult(req);
        if(!errores.isEmpty()){
            return res.status(400).json({errores:errores.array()});
        }
       
        //buscar el usuario registrado

    const {email,password} = req.body;
    const usuario = await Usuario.findOne({ email});
   // console.log(usuario)
if(!usuario){
    return res.status(401).json({msg: 'el usuario no existe pa'})
    return next();
}
        //verificar el pass y autenticar usuario
if(bcrypt.compareSync(password,usuario.password)){
    const token = jwt.sign({
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
    },process.env.SECRETA,{
        expiresIn : '1h'
    });
    res.json({token})
}else{
    res.status(401).json({message:'el password es incorrecto'})
    return next();
}


}

exports.usuarioAutenticado = async (req,res,next)=>{

    res.json({usuario:req.usuario});

}