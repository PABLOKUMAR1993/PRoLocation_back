"use strict";

// Importaciones

const express = require('express');
const router = express.Router();
require('dotenv').config();


// Métodos Rest.


////// Método para crear un cambio de distribución
router.post("/createDistributionChange", (req, res) => {
    const db = req.app.locals.db;
    const distributionChange = req.body;

    db.collection("distributionChanges").insertOne(distributionChange, function (err, respuesta) {
       
        if (err != null) {
            console.log("Ha habido un error al insertar en distributionChanges: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en distributionChanges: " + err });
        
        } else {
            console.log("DistributionChanges creado correctamente");
            res.send({ mensaje: "DistributionChanges creado correctamente" });
        }
    });

});


// Export

module.exports = router;