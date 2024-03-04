require('dotenv').config(); // Carga las variables de entorno desde .env
require('./models/userMongoSchema');
const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');

const PORT = process.env.PORT || 4000;
const app = express(); // Muevo esta línea aquí

dbConnect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(PORT, () => {
    console.log(`Servidor está corriendo en el puerto ${PORT}`);
});
