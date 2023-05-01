"use strict";
// Importaciones
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

require('dotenv').config();


// Rest

router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    console.log(name);
    console.log(email);
    console.log(subject);
    console.log(message);
    /*contentHTML = `
        <h1>Información del usuario</h1>
        <ul>
            <li>Nombre: ${name}</li>
            <li>Email: ${email}</li>
            <li>Asunto: ${subject}</li>
        </ul>
        <p>${message}</p>
    `;*/
    //console.log(contentHTML);

    //Configuración del host
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'login',
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD_API
        }

    });

    //Verificación de envio
    transporter.verify().then(() => {
        console.log("Enviando email...");
    }).catch(err => console.log(err));

    //Método asincrono para envío de correo
    const info = await transporter.sendMail({
        from: "'PRoLocation'<prolocationtfg@gmail.com>",
        to: 'rh_gil@yahoo.es',
        subject: 'Formulario de contacto',
        //html: contentHTML
    })

    console.log("Mensaje enviado", info.messageId);
    res.send("El correo ha sido enviado correctamente");

});
attachments: [
    {
      filename: '1682274239051 - 52714.jpg',
      path: '../uploads'
    }
  ]
// Export

module.exports = router;