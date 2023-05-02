"use strict";
// Importaciones
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();


// Rest

router.post('/contact', (req, res) => {

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

// Export

module.exports = router;