"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();

//Método para crear un cambio de aceite
router.post("/createOilChange", (req, res) => {
    const db = req.app.locals.db;
    const oilChange = req.body;

    db.collection("oilChanges").insertOne(oilChange, function (err, respuesta) {
       
        if (err != null) {
            console.log("Ha habido un error al insertar en oilChanges: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en oilChanges: " + err });
        
        } else {
            console.log("OilChange creado correctamente");
            res.send({ mensaje: "OilChange creado correctamente" });
        }
    });

});

// Export

module.exports = router;