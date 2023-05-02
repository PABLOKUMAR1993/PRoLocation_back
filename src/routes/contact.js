"use strict";
// Importaciones
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();


// Ruta para la solicitud POST del formulario de contacto
router.post('/contact', async (req, res) => {
    try {
        // Extraemos los datos del formulario
        const { nombre, email, asunto, mensaje } = req.body;
        
        // Configuramos el servicio de correo
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
        
        // Creamos el objeto para enviar el correo
        let emailSend = {
            from: "'PRoLocation'<prolocationtfg@gmail.com>",
            to: 'rh_gil@yahoo.es',
            subject: 'Formulario de contacto',
            html: ` 
            <h1>Información del usuario</h1>
            <p><b>Nombre:</b> ${nombre}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Asunto:</b> ${asunto}</p>
            <br>
            <p>${mensaje}</p>
            `
        };
        
        // Creamos el objeto transportador para enviar el correo
        let createTransport = nodemailer.createTransport(jConfig);
        
        // Enviamos el correo y mostramos los detalles en la consola

        /*Creamos la variable info para almacenar la respuesta del servidor 
        contiene información como el estado del envío del correo electrónico, 
        la hora de envío, el ID del mensaje y otros detalles adicionales por si lo necesitaramos en un futuro.
        */
        let info = await createTransport.sendMail(emailSend);

        //Mostramos los datos en consola
        console.log();
        console.log("Correo enviado correctamente");
        console.log();
        console.log("* Nombre: " + `${JSON.stringify(req.body.nombre)}`);
        console.log("* Email: " + `${JSON.stringify(req.body.email)}`);
        console.log("* Asunto: " + `${JSON.stringify(req.body.asunto)}`);
        console.log("* Mensaje: " + `${JSON.stringify(req.body.mensaje)}`);
       
        // Cerramos la conexión con el servidor de correo
        createTransport.close();
        
        // Enviamos una respuesta HTTP 200 con el mensaje de éxito
        res.status(200).send("Correo enviado correctamente");
    } catch (error) {
        // Mostramos los detalles del error en la consola y enviamos una respuesta HTTP 500
        console.log("Error al enviar email", error);
        res.status(500).send("Error al enviar email");
    }
});


// Export

module.exports = router;