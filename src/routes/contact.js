// Importaciones

const express = require('express');
const router = express.Router();
require ('dotenv').config();


// Rest

/**
 * Raúl, cambia este método por el de node mailer o bien reutilizalo si fuera necesario.
 */
router.post('/contact',(req, res) => {

    // Esto raul luego lo borras, lo he dejado para que veas cómo se accede a los diferentes elementos
    const { email } = req.body;
    const { subject } = req.body;
    const { message } = req.body;
    const file = req.files[0];

    console.log( "email: " + email );
    console.log( "subject: " + subject );
    console.log( "message: " + message );

    // Esto hay que hacerlo así, porque llega un [object Object] y sólo con el .stringify muestra el objeto
    // en línea y se lee difícil, con ese forEach hago que aparezca cada propiedad en una línea,
    // facilitando la lectura.
    const fileData = JSON.parse(JSON.stringify(file));
    for (const prop in fileData) {
        console.log(`${prop}: ${fileData[prop]}`);
    }

    // Este es el único código que necesito que me devuelvas.
    // Con lo demás haz lo que quieras. menos dejarlo así.
    res.send({ mensaje: "Mensaje recibido" });
});


// Export

module.exports = router;