"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const { bcryptEncrypt, bcryptDecrypt } = require("../middleware/bcrypt")
const { generateToken }  = require("../middleware/jwt");
require("dotenv").config();


// Métodos Rest.


////// SignUp.

router.post("/signup", bcryptEncrypt, async (req, res) => {

    // Recupero la conexión a la bbdd.
    const db = req.app.locals.db;

    // Recupero el usuario del body.
    const userBody = req.body;

    // Compruebo si el usuario ya existe.
    await db.collection( process.env.DB_COLECTION_USERS )
    .find({ email: userBody.email })
    .toArray( async (err, user) => {

        // Si no ha encontrado usuarios, lo inserto.
        if ( user.length === 0 ) {
            await db.collection( process.env.DB_COLECTION_USERS )
            .insertOne({ 
                nombre: userBody.nombre,
                apellido: userBody.apellido,
                email: userBody.email,
                password: userBody.password,
                fechaAlta: userBody.fechaAlta,
                estado: userBody.estado,
                vehiculos: userBody.vehiculos
             },
                (err, data) => {
                if (err != null) {
                    console.log( `Ha habido un error al crear el usuario: ${err}` );
                    res.status(500).send({ mensaje: `Ha habido un error al insertar el usuario: ${err}` });
                } else {
                    console.log( `Usuario registrado correctamente, ID: ${ JSON.stringify(data) }` );
                    res.status(200).send(`Usuario registrado correctamente, ID: ${ JSON.stringify(data) }`);
                }
            });
        } else {
            console.log("El usuario ya existe.");
            res.status(409).send({ mensaje: "El usuario ya existe." });
        }
    });

});


////// SignIn.

router.post("/signin", async (req, res) => {

    // Recupero la conexión a la bbdd.
    const db = req.app.locals.db;

    // Recupero el usuario del body.
    const userBody = req.body;

    // Compruebo si el usuario existe.
    await db.collection( process.env.DB_COLECTION_USERS )
    .find({ email: userBody.email })
    .toArray( async (err, user) => {
        if ( err != null ) {
            console.log( `SignIn: Ha habido un error al buscar el usuario: ${err}` );
            res.status(500).send( `SignIn: Ha habido un error al buscar el usuario: ${err}` );
        } else {

            // Parseo el usuario para poder acceder a sus propiedades.
            const userP = JSON.parse(JSON.stringify(user));

            // Compruebo si la contraseña es correcta.
            if ( bcryptDecrypt( userBody.password, userP[0].password ) ) {
                console.log( "SignIn: Contraseña correcta." );
                // Genero el token y lo envío.
                const token = generateToken( userP[0] );
                res.status(200).send({ token });
            } else {
                console.log( "SignIn: Contraseña incorrecta." );
                res.status(401).send({ mensaje: "SignIn: Contraseña incorrecta." });
            }

        }
    });

});


// Exportaciones

module.exports = router;