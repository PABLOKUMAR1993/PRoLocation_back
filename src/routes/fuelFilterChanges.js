"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();


// Métodos Rest.


////// Método para crear un cambio de combustible
router.post("/createFuelFilterChange", (req, res) => {
    const db = req.app.locals.db;
    const fuelFilterChange = req.body;

    db.collection("fuelFilterChanges").insertOne(fuelFilterChange, function (err, respuesta) {

        if (err != null) {
            console.log("Ha habido un error al insertar en createFuelFilterChanges: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en createFuelFilterChanges: " + err });

        } else {
            console.log("FuelFilterChange creado correctamente");
            res.send({ mensaje: "FuelFilterChange creado correctamente" });
        }
    });

});


// Export

module.exports = router;