require('dotenv').config(); // Carga las variables de entorno desde .env
require('./models/userModel');
const express = require('express');
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');
const PORT = process.env.PORT || 4000;
const app = express(); 
const authRouter=require('./routes/authRoute');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const morgan=require('morgan');
const dotenv = require("dotenv").config();


dbConnect();
const cors = require('cors');

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor está corriendo en el puerto ${PORT}`);
});
