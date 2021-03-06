const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crdear el servidor del servidor

const app = express();

//conectando ala bd de nodesend
conectarDB();

const opcionCors = {
   origin : process.env.FRONTEND_URL
}

//habilitamos cors 

app.use(cors(opcionCors));
console.log('comenzando nodesend')

// puerto de la app de la app
const port = process.env.PORT || 4000;

//habuilitar los valores de un body 
app.use(express.json());


app.use(express.static('uploads'));

// rutas de la app de 
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))



// arrancar el servidor
app.listen(port, '0.0.0.0',()=>{
    console.log(`èl servidor edsta arrancanso en el puerto ${port}`);
})
