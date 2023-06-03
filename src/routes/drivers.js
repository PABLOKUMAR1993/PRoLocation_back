"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken } = require("../middleware/jwt");
const { ObjectId } = require('mongodb');
const db = require("../lib/db");
const {findVehicleById} = require("../lib/utils");
require("dotenv").config();


// Métodos Rest


////// Método para crear un conductor.
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

////// Método que añade un conductor a un vehículo.
router.post('/addDriverToVehicle', async function (req, res) {
  try {
    // Obtener la instancia de la base de datos desde el objeto "req.app.locals"
    const db = req.app.locals.db;

    // Obtener el id del vehículo y el id del conductor del cuerpo de la solicitud
    const idVehicle = req.body.idVehiculo;
    const idConductor = req.body.idConductor;

    const errores = [];

    // Verificar el formato del idVehiculo
    if (!ObjectId.isValid(idVehicle)) {
      errores.push('El id del vehículo no tiene el formato correcto');
    }

    // Verificar el formato del idConductor
    if (!ObjectId.isValid(idConductor)) {
      errores.push('El id del conductor no tiene el formato correcto');
    }

    // Comprobar si faltan el id del vehículo o el id del conductor
    if (!idVehicle) {
      errores.push('Falta el id del vehículo');
    }

    if (!idConductor) {
      errores.push('Falta el id del conductor');
    }

    // Si hay errores, devolver una respuesta de estado 400 (Solicitud incorrecta) con los mensajes de error
    if (errores.length > 0) {
      res.status(400).json({ errores });
      return;
    }

    // Buscar el vehículo en la base de datos por su id
    const vehicle = await findVehicleById(idVehicle);

    // Comprobar si el vehículo existe
    if (!vehicle) {
      res.status(404).json({ mensaje: 'Vehículo no encontrado' });
      return;
    }

    // Verificar si el idConductor existe en la colección drivers
    const existingDriver = await db.collection('drivers').findOne({ "_id": ObjectId(idConductor) });

    // Comprobar si el idConductor no existe en la colección drivers
    if (!existingDriver) {
      res.status(404).json({ mensaje: 'Conductor no encontrado' });
      return;
    }

    // Comprobar si el idConductor es igual al idConductor actual del vehículo
    if (vehicle.idConductor && vehicle.idConductor.toString() === idConductor) {
      res.status(400).json({ mensaje: 'El conductor ya está asignado a este vehículo' });
      return;
    }

    // Actualizar el campo idConductor del vehículo con el nuevo valor
    await db.collection('vehicles').updateOne({ "_id": ObjectId(idVehicle) }, { $set: { "idConductor": ObjectId(idConductor) } });

    // Buscar el vehículo actualizado en la base de datos
    const updatedVehicle = await findVehicleById(idVehicle);

    // Devolver el mensaje de éxito y el vehículo actualizado en la respuesta
    res.send({ mensaje: 'Conductor agregado al vehículo correctamente', vehicle: updatedVehicle });
  } catch (error) {
    console.error('Error al agregar conductor al vehículo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

////// Método que devuelve el conductor del vehículo.
router.get('/driverVehicle/:idVehiculo', verifyToken, async function (req, res) {
    const db = req.app.locals.db;
    try {
      // Obtener el id del vehículo de los parámetros de la solicitud
      const idVehiculo = req.params.idVehiculo;
  
      // Verificar el formato del idVehiculo
      if (!ObjectId.isValid(idVehiculo)) {
        res.status(400).json({ mensaje: 'El id del vehículo no tiene el formato correcto' });
        return;
      }
  
      // Buscar el vehículo en la base de datos por su id
      const vehicle = await findVehicleById(idVehiculo);
  
      // Comprobar si el vehículo existe
      if (!vehicle) {
        res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        return;
      }
  
      // Verificar si el vehículo tiene un idConductor
      if (!vehicle.idConductor) {
        res.status(404).json({ mensaje: 'El vehículo no tiene un conductor asignado' });
        return;
      }
  
      // Obtener el conductor correspondiente al idConductor del vehículo
      const driver = await db.collection('drivers').findOne({ "_id": vehicle.idConductor });
  
      // Comprobar si el conductor existe
      if (!driver) {
        res.status(200).send( null );
        return;
      }
  
      // Devolver el conductor correspondiente al vehículo en la respuesta
      res.status(200).send( driver );
    } catch (error) {
      console.error('Error al obtener el conductor del vehículo:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


// Export

module.exports = router;