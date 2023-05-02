"use strict";

// Importaciones

const express = require('express');
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require("multer");

const upload = multer();

//Middleware

// Configurar el middleware para procesar datos POST
app.use(express.urlencoded({ extended: true })); // Para formularios
app.use(express.json());
app.use(upload.array()); // for parsing multipart/form-data

// BBDD

MongoClient.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if (err != null) {
            console.log(`Error al conectar a la bbdd: ${err}`);
        } else {
            console.log("Conexión con la base de datos realizada correctamente");
            app.locals.db = client.db(process.env.DB_NAME);
        }
    });

//************** Método para enviar email *******************
app.post('/contact', (req, res) => {
    // Extraemos los datos del formulario de contacto
    const { nombre, email, asunto, mensaje } = req.body;

    // Configuración para el envío del correo
    let jConfig = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'login',
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD_API}`
        }
    };

    /*
    Definimos el JSON de datos que se debe crear para establecer la comunicación con el servidor de correos, 
    en donde se incluyen los datos de los destinatarios, asunto, mensaje, etc..
    */

    let emailSend = {
        from: "'PRoLocation'<prolocationtfg@gmail.com>", //remitente
        to: 'rh_gil@yahoo.es', //destinatario
        subject: 'Formulario de contacto', //asunto del correo
        html: ` 
        <h1>Información del usuario</h1>
        
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Asunto:</b> ${asunto}</p>
        <br>
        <p>${mensaje}</p>
`}

    /*
    Una vez hemos definido la configuración a utilizar y los datos del correo a enviar, 
    creamos un objeto transportador a través del siguiente método "createTransport".
    */
    let createTransport = nodemailer.createTransport(jConfig);

    //Este objeto crea una variable de transporte que se comunicara con el servidor SMTP y enviará el correo.

    createTransport.sendMail(emailSend, function (error, info) {
        if (error) {
            console.log("Error al enviar email");
        } else {
            console.log();
            console.log("Correo enviado correctamente");
            console.log();
            console.log("* Nombre: " + `${JSON.stringify(req.body.nombre)}`);
            console.log("* Email: " + `${JSON.stringify(req.body.email)}`);
            console.log("* Asunto: " + `${JSON.stringify(req.body.asunto)}`);
            console.log("* Mensaje: " + `${JSON.stringify(req.body.mensaje)}`);
        }
        createTransport.close();
    });
});

/************************************************************************************************************
 * **********************************************************************************************************
 * *********************************************************************************************************
 */

// Ruta para manejar el envío de correos electrónicos


// Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dónde se guardará
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname); // Fecha actual + nombre original (evita duplicidad).
    }
});


const uploads = multer({ storage: storage });


// Routes

const contact = require("./routes/contact");
app.use("/api", contact);

const auth = require("./routes/auth");
app.use("/api", auth);

const users = require("./routes/users");
app.use("/api", users);

const vehicles = require("./routes/vehicles");
app.use("/api", vehicles);

const devices = require("./routes/devices");
app.use("/api", devices);



// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
