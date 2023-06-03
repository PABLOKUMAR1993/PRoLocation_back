"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();


// Atributos.

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'login',
        user: `${process.env.EMAIL_FROM}`,
        pass: `${process.env.EMAIL_PASSWORD_API}`
    }
});


// Métodos Rest


////// Método para gestionar el envío de correos electrónicos.
router.post('/contact', async (req, res) => {

    // Extraemos los datos del formulario
    const { email, subject, message } = req.body;
    const file = req.file;

    // Creamos el objeto para enviar el correo
    const mailOption = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: subject,
        html: `
            <h1>Información del usuario</h1>
            <p><b>Email:</b> ${email}</p>
            <p><b>Asunto:</b> ${subject}</p>
            <br>
            <p>${message}</p>
        `,
        attachments: [{
            filename: file.originalname,
            path: file.path,
        }]
    };

    // Enviamos el correo
    await transporter.sendMail(mailOption, (err, info) => {

        if (err) {
            console.log(err);
            res.status(500).send({
                error: err.message, mensaje: "Ocurrió un error al enviar el correo electrónico"
            });
        } else {
            console.log("Correo enviado correctamente");
            res.status(200).send({ mensaje: "Correo enviado correctamente" });
        }

    });

});


// Export

module.exports = router;
