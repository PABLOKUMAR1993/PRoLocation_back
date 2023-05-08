"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();

//Método para crear un cambio de filtro de aire
router.post("/createAirFilterChange", (req, res) => {
    const db = req.app.locals.db;
    const airFilterChange = req.body;
    // Busca el usuario que coincida con el email pasado por parámetro
    db.collection("airFilterChanges").insertOne(airFilterChange, function (err, respuesta) {
        // Si se produce un error al intentar insertar el usuario, devuelve un error
        if (err != null) {
            console.log("Ha habido un error al insertar en createAirFilterChange: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en createAirFilterChange: " + err });
            // Si no se produce error, inserta el usuario en la db y envia mensaje de Vehículo creado correctamente.
        } else {
            console.log("AirFilterChange creado correctamente");
            res.send({ mensaje: "AirFilterChange creado correctamente" });
        }
    });

});





// Export

module.exports = router;