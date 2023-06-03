"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();


// Métodos Rest


////// Método para crear un cambio de filtro de aire
router.post("/createAirFilterChange", (req, res) => {
    const db = req.app.locals.db;
    const airFilterChange = req.body;

    db.collection("airFilterChanges").insertOne(airFilterChange, function (err, respuesta) {

        if (err != null) {
            console.log("Ha habido un error al insertar en airFilterChanges: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en airFilterChanges: " + err });

        } else {
            console.log("AirFilterChange creado correctamente");
            res.send({ mensaje: "AirFilterChange creado correctamente" });
        }
    });

});


// Export

module.exports = router;