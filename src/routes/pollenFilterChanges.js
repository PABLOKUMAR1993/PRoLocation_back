"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();

//Método para crear un cambio de filtro de polen
router.post("/createPollenFilterChange", (req, res) => {
    const db = req.app.locals.db;
    const pollenFilterChange = req.body;

    db.collection("pollenFilterChanges").insertOne(pollenFilterChange, function (err, respuesta) {
       
        if (err != null) {
            console.log("Ha habido un error al insertar en pollenFilterChanges: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en pollenFilterChanges: " + err });
        
        } else {
            console.log("PollenFilterChange creado correctamente");
            res.send({ mensaje: "PollenFilterChange creado correctamente" });
        }
    });

});





// Export

module.exports = router;