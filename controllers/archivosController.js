 const multer = require('multer');
 const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace')

exports.subirArchivo = async (req,res,next)=>{

    const configuracionMulter = {
        limist : {fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage : fileStorage = multer.diskStorage({
            destination : (req, file, cb) => {
                cb(null,__dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
   }
  const upload = multer(configuracionMulter).single('archivo');
    upload(req,res, async(error)=>{
        console.log(req.file);

        if(!error){
            res.json({archivo: req.file.filename});
        }else{
            console.log(error)
            return next();
        }
    });

}



exports.eliminarArchivo = async (req,res)=>{
  console.log(req.archivo);

  try {
      fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
      console.log('archivo eliminado');
  } catch (error) {
        console.log(error);

  }
}

//descarga un archuvo
exports.descargar = async (req, res,next)=>{

    console.log('entraste en descargar ');
    
    //obrtiene el enlace 
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre : archivo});
   
    console.log({enlace});
  
 
 
     const archivoDescarga = __dirname + '/../uploads/' + archivo;
     res.download(archivoDescarga);
    
    // console.log({archivoDescarga});
    // console.log('el problema esta en la asignacion de archivos');
    // console.log('que paso acac');

   const { descargas ,nombre} = enlace;
      
       if(descargas === 1 ){
         // eliminar el archivo 
          req.archivo = nombre;
         //eliminar entrada ala bd 
        await  Enlaces.findOneAndRemove(enlace.id);
         next();
     }else{
       
        // si las descarags son > a 1 entoces restar a -1 
        enlace.descargas--;
        await enlace.save();
       
     }
 
   
 }