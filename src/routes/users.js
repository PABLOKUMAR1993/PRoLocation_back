"use strict";
// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();


//Añadir usuario
//Método que crea un nuevo usuario en la base de datos
router.post("/createUser", (req, res) => {
    const db = req.app.locals.db;
    const user = req.body;
    // Busca el usuario que coincida con el email pasado por parámetro
    db.collection("users")
        .find({ email: user.email })
        .toArray(function (err, users) {
            // Si se produce un error envía un mensaje de error
            if (err != null) {
                console.log("Ha habido un error al buscar en createUser: ");
                console.log(err);
                res.send({ mensaje: "Ha habido un error al buscar en createUser: " + err });
                return;
            } else {
                // Si no encuentra ningún usuario con el mismo email lo inserta en la db
                if (users.length === 0) {
                    db.collection("users").insertOne(user, function (err, respuesta) {
                        // Si se produce un error al intentar insertar el usuario, devuelve un error
                        if (err != null) {
                            console.log("Ha habido un error al insertar en createUser: ");
                            console.log(err);
                            res.send({ mensaje: "Ha habido un error al insertar en createUser: " + err });
                            // Si no se produce error, inserta el usuario en la db y envia mensaje de Vehículo creado correctamente.
                        } else {
                            console.log("Usuario creado correctamente");
                            res.send({ mensaje: "Usuario creado correctamente" });
                        }
                    });
                } else {
                    console.log("Ya existe un Usuario registrado con ese email")
                    res.send({ mensaje: "Ya existe un Usuario registrado con ese email" });
                }
            }
        });
});



// Export

module.exports = router;