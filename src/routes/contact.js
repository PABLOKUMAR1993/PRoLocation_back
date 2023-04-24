// Importaciones
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require ('dotenv').config();

// Rest

/**
 * Raúl, cambia este método por el de node mailer o bien reutilizalo si fuera necesario.
 */
router.post('/contact', async (req, res) => {

    const { email, subject, message } = req.body;
    const file = req.files[0];
    contentHTML = `
        <h1>Información del usuario</h1>
        <ul>
            <li>Email: ${email}</li>
            <li>Subject: ${subject}</li>
          </ul>
        <p>${message}</p>
        
    `;
    console.log(contentHTML);

    const fileData = JSON.parse(JSON.stringify(file));
    for (const prop in fileData) {
        console.log(`${prop}: ${fileData[prop]}`);
    }

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
        from: "'PRoLocation'<process.env.EMAIL>",
        to: 'rh_gil@yahoo.es',
        subject: 'Formulario de contacto',
        html: contentHTML,
        /*attachments: [
            {
              filename: '1682274239051 - 52714.jpg',
              path: '../uploads/1682274239051 - 52714.jpg'
            }
          ]*/
    })

    console.log("Mensaje enviado", info.messageId);
    res.send({ mensaje: "Mensaje recibido" });
    
});

// Export

module.exports = router;