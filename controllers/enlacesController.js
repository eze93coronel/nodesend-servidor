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
     const {nombre_original,nombre}= req.body;

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
};

//retorna si el enlace rtiene password p
exports.tienePassword = async (req,res,next) => {

  const {url} = req.params;
  console.log(url);


  const enlace = await Enlaces.findOne({url});

  if(!enlace) {
    res.status(404).json({message:' ese enlace no existe pa'});
    return next();
  } 

if(enlace.password){
  return  res.json({ password :true, enlace: enlace.url});
}
  next();

}

//verfiica si el password es correcto

exports.verificarPassword = async (req,res,next) => {
  console.log('verificando');
  const {url} = req.params
  const {password} = req.body;

// consukltar por el enlace 
const enlace = await Enlaces.findOne({url})


//verifcar el password
if(bcrypt.compareSync(password,enlace.password)){
   //permitir descargar el archivo al usuario
  next();
}else{
 return  res.status(401).json({message: 'el password es incorrecto'})
}

 


  
}



//obtener le enlace 

exports.obtenerEnlace = async(req,res,next)=>{
      
  const {url} = req.params;
  console.log(url);

        const enlace = await Enlaces.findOne({url});

//console.log({enlace});

      if(!enlace) {
        res.status(404).json({message:' ese enlace no existe pa'});
        return  next();
      } 
    
      // si el enlace existe
      res.json({archivo: enlace.nombre, password : false})
  


next();


};

