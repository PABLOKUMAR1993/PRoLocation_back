"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();

//Método para insertar un mantenimiento en el array correspondiente
router.post("/createMaintenance", (req, res) => {
    const db = req.app.locals.db;
    const maintenance = req.body;

    db.collection("maintenance").insertOne(maintenance, function (err, respuesta) {

        if (err != null) {
            console.log("Ha habido un error al insertar en maintenance: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en maintenance: " + err });

        } else {
            console.log("Maintenance creado correctamente");
            res.send({ mensaje: "MaintenanceChange creado correctamente" });
        }
    });

});





// Export

module.exports = router;