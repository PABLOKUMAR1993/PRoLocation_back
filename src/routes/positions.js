"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();


// Métodos Rest.


////// Método para crear una posición.
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

////// Asignar posicion al dispositivo.
router.post('/addPositionToDevice', async function (req, res) {
  // Obtener la instancia de la base de datos desde el objeto "req.app.locals"
  const db = req.app.locals.db;

  try {
    // Obtener los datos por el body
    const idPosicion = req.body.idPosicion;
    const idDispositivo = req.body.idDispositivo;

    console.log("idPosicion: " + idPosicion);
    console.log("idDispositivo: " + idDispositivo);

    //Comprueba si el formato del id es correcto o no. 
    //Este debe ser tipo cadena de 12 bytes, una cadena de 24 caracteres hexadecimales o un número entero.
    const idPosicionRegExp = /^[0-9a-fA-F]{24}$/; // Expresión regular para validar una cadena de 24 caracteres hexadecimales

    if (!idPosicionRegExp.test(idPosicion)) {
      res.status(400).json({ mensaje: 'La ID de posición no tiene el formato correcto' });
      return;
    }
    // Buscar la posicion por su _id en la colección "positions" de la base de datos
    const posicion = await db.collection('positions').findOne({ _id: ObjectId(idPosicion) });
    // Si la posición no se encuentra, devolver un mensaje de error y un estado 404
    if (!posicion) {
      res.status(404).json({ mensaje: 'Posición no encontrada' });
      return;
    }
    // Buscar el dispositivo por su id en la colección "devices" de la base de datos
    const dispositivo = await db.collection('devices').findOne({ _id: ObjectId(idDispositivo) });
    // Si el dispositivo no se encuentra, devolver un mensaje de error y un estado 404
    if (!dispositivo) {
      res.status(404).json({ mensaje: 'Dispositivo no encontrado' });
      return;
    }
    console.log(dispositivo.posiciones)
    // Comprobar si la posición ya está en la lista de posiciones del dispositivo
      if (dispositivo.posiciones) {
        let encontrada = false;
        for (let i = 0; i < dispositivo.posiciones.length; i++) {
          if (dispositivo.posiciones[i].equals(posicion._id)) {
            // Código a ejecutar si se encuentra la coincidencia
            encontrada = true;
            break; // Opcional: salir del bucle si se encuentra la coincidencia
          }
        }
        if (encontrada) {
            res.status(409).json({ mensaje: 'La posición ya está asociada al dispositivo' });
            return;
        }
    }

    // Actualizar el dispositivo en la base de datos con la nueva posición
    const result = await db.collection('devices').updateOne(
      { _id: ObjectId( idDispositivo ) },
      { $push: { posiciones: posicion._id } }
    );

    if (result.modifiedCount !== 1) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
      return;
    }

    // Obtener el dispositivo actualizado de la base de datos y devolverlo como respuesta
    const dispositivoActualizado = await db.collection('devices').findOne({ idDispositivo });
    res.send(dispositivoActualizado);
  } catch (error) {
    // Si ocurre un error al buscar el dispositivo o al actualizar la base de datos, devolver un mensaje de error y un estado 500
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


// Export

module.exports = router;