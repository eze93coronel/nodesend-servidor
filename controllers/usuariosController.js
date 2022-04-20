const Usuario = require('../models/Usuarios')
const bcrypt = require('bcrypt'); // depemdencia de hasheoo de pass
 const {validationResult} =  require('express-validator');
exports.nuevoUsuario = async (req,res)=>{

    //mostrando los errores de expreess validator para

 const errores =validationResult(req);
 if(!errores.isEmpty()){
     return res.status(400).json({errores:errores.array()});
 }

// verificar si el usuario esta dadao de alta en la base de datos
const {email, password} = req.body;

let usuario = await Usuario.findOne({email});

if(usuario){
    return res.status(400).json({msg: 'Usuario ya existente'})
}
   //creando un nuevo ususario
    usuario = new Usuario(req.body);

    //hashear password con bcrypt
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    
    try {
           
   await usuario.save()

   res.json({msg: 'success usuario creado'});

    } catch (error) {
        console.log('hubo un error al crear tu nuevo usuario')
        console.log(error)
    }
 
}

