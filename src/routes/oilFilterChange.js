"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();

//Método para crear un cambio de filtro de aceite
router.post("/createOilFilterChange", (req, res) => {
    const db = req.app.locals.db;
    const oilFilterChange = req.body;

    db.collection("oilFilterChanges").insertOne(oilFilterChange, function (err, respuesta) {
       
        if (err != null) {
            console.log("Ha habido un error al insertar en oilFilterChanges: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en oilFilterChanges: " + err });
        
        } else {
            console.log("OilFilterChange creado correctamente");
            res.send({ mensaje: "OilFilterChange creado correctamente" });
        }
    });

});





// Export

module.exports = router;