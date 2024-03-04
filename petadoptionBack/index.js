const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config(); // Carga las variables de entorno desde .env
const app = express()
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const mongoUrl = process.env.mongoUrl;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // Agregué configuraciones para evitar advertencias
mongoose.connection.on('connected', () => {
    console.log('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error al conectar a MongoDB:', err);
});
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());
app.get('/',(req,res)=>{
    res.send('hello')
})

app.listen(PORT,()=>{
    console.log(`Servidor esta corriendo en el puerto ${PORT}` )
})