"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken }  = require("../middleware/jwt");
require("dotenv").config();


// Métodos Rest

//Método para crear un dispositivo
router.post("/createPosition", (req, res) => {
    const db = req.app.locals.db;
    const position = req.body;

    db.collection("positions").insertOne(position, function (err, respuesta) {
       
        if (err != null) {
            console.log("Ha habido un error al insertar en devices: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al insertar en devices: " + err });
        
        } else {
            console.log("Devicee creado correctamente");
            res.send({ mensaje: "Device creado correctamente" });
        }
    });

});

//Asignar posicion al dispositivo
router.post('/addPositionToDevice', async function (req, res) {
    // Obtener la instancia de la base de datos desde el objeto "req.app.locals"
    const db = req.app.locals.db;
  
    try {
      // Obtener los datos por el body
      const _id = req.body.idPosicion;
      const idDispositivo = req.body.idDispositivo;
      console.log(_id);
      console.log(idDispositivo);
  
      // Buscar la posicion por su _id en la colección "positions" de la base de datos
      const posicion = await db.collection('positions').findOne({ _id });
      console.log(posicion);
  
      // Si dispositivo no se encuentra, devolver un mensaje de error y un estado 404
      if (!posicion) {
        res.status(404).json({ mensaje: 'Posicion no encontrada' });
        return;
      }
      // Buscar el dispositivo por su matrícula en la colección "dispositivos" de la base de datos
      const dispositivo = await db.collection('devices').findOne({ idDispositivo });
      // Si el vehículo no se encuentra, devolver un mensaje de error y un estado 404
      if (!dispositivo) {
        res.status(404).json({ mensaje: 'Dispositivo no encontrado' });
        return;
      }
      // Comprobar si la posicion ya está en la lista de posiciones del dispositivo
      if (dispositivo.idPosicion) {
        if (dispositivo.idPosicion === posicion._id) {
          res.status(409).json({ mensaje: 'La posicion ya está asociada al dispositivo' });
        // Actualizar el dispositivo en la base de datos con la lista de dispositivos actualizada
        } else {
          await db.collection('devices').updateOne({ dispositivo }, { $set: { idPosicion: posicion._id } });
        }
      } else {
        // Si está vacío.
        await db.collection('devices').updateOne({ dispositivo }, { $set: { idPosicion: posicion._id } });
      }
      // Devolver el dispositivoactualizado como respuesta
      res.send(dispositivo);
    } catch (error) {
      // Si ocurre un error al buscar el vehículo o al actualizar la base de datos, devolver un mensaje de error y un estado 500
      console.error(error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


// Export

module.exports = router;