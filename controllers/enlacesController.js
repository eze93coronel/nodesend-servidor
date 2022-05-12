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
   //  console.log(req.body);

   // craer un objeto de enlace
     const {nombre_original, password,nombre}= req.body;

     const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
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
};

//obtiene un listado de los enlaces ela app 
exports.todosEnlaces = async(req,res)=>{
  try {
    const enlaces = await Enlaces.find({}).select('url -_id');
    res.json({enlaces});
  } catch (error) {
    console.log(error)
  }
}




//obtener le enlace 

exports.obtenerEnlace = async(req,res,next)=>{
      
  const {url} = req.params;
  console.log(url);

        const enlace = await Enlaces.findOne({url});

      if(!enlace) {
        res.status(404).json({message:' ese enlacce no exizste pa'});
      } 
    
      // si el enlace existe
      res.json({archivo: enlace.nombre})
  
      next()

    

}