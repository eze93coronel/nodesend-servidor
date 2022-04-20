  const Enlaces = require('../models/Enlace');
    const shortid = require('shortid');
    const bcrypt = require('bcrypt');
    const {validationResult} =  require('express-validator');
exports.nuevoEnlace = async (req,res,next) => {
   // verificar si ahi errores 
   const errores =validationResult(req);
   if(!errores.isEmpty()){
       return res.status(400).json({errores:errores.array()});
   }

   // craer un objeto de enlace
     const {nombre_original, password}= req.body;

     const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;
  

    // sin el usuario esta autenticado
if(req.usuario){
    const {password,descargas} = req.body;
    
    //ASIGNAR ENLACE AL NUMERO DE DESCARGAS
    if(descargas){
      enlace.descargas = descargas;
    }
     // ASIGNAR UN PASSWORD
    if(password){
        const salt = await bcrypt.genSalt(10);
     enlace.password = await bcrypt.hash(password, salt);
    
    }

    // ASIGNAR EL AUTOR 
    enlace.autor = req.usuario.id;
}

    // alamacenando en la bd
   try {
       await enlace.save();
    return   res.json({msg:`${enlace.url}`})
   } catch (error) {
       
   }

    console.log(enlace)
}

//obtener le enlace 

exports.obtenerEnlace = async(req,res,next)=>{
      
  const {url} = req.params;
        const enlace = await Enlaces.findOne({url});

      if(!enlace) {
        res.status(404).json({message:' ese enlacce no exizste pa'});
      } 
    
      // si el enlace existe
      res.json({archivo: enlace.nombre})

      //si la descargas son = a 1 entoces borrar ese archivo y borrar esa entrada
      const {descargas,nombre} = enlace;
     
   if(descargas === 1 ){
       // eliminar el archivo 
        req.archivo = nombre;
       //eliminar entrada ala bd 
         Enlaces.findOneAndRemove(req.params.url);

       next();
   }else{
     
      // si las descarags son > a 1 entoces restar a -1 
      enlace.descargas--;
      await enlace.save();
     
   }

}