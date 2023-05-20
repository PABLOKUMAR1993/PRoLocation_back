"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken } = require("../middleware/jwt");
const { ObjectId } = require('mongodb');
const db = require("../lib/db");
require("dotenv").config();

// Métodos Rest

// Método para crear un conductor
router.post("/createDrivers", (req, res) => {
    const db = req.app.locals.db;
    const driver = req.body;
  
    // Verificar si ya existe un conductor con el mismo DNI
    db.collection("drivers")
      .findOne({ dni: driver.dni })
      .then((existingDriver) => {
        if (existingDriver) {
          // Ya existe un conductor con ese DNI
          console.log("El conductor con ese DNI ya existe");
          res.send({ mensaje: "El conductor con ese DNI ya existe" });
        } else {
          // No existe un conductor con ese DNI, crear uno nuevo
          db.collection("drivers").insertOne(driver, function (err, respuesta) {
            if (err) {
              console.log("Ha habido un error al insertar en drivers: ");
              console.log(err);
              res.send({
                mensaje: "Ha habido un error al insertar en drivers: " + err,
              });
            } else {
              console.log("Driver creado correctamente");
              res.send({ mensaje: "Driver creado correctamente" });
            }
          });
        }
      })
      .catch((error) => {
        console.log("Ha habido un error al buscar en drivers: ");
        console.log(error);
        res.send({ mensaje: "Ha habido un error al buscar en drivers: " + error });
      });
  });

module.exports = router;