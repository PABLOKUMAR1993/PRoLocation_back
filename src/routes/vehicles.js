"use strict";
// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//Añadir vehículo
//Método que crea un nuevo vehículo en la base de datos
router.post("/createVehicle", (req, res) => {
    const db = req.app.locals.db;
    const vehicle = req.body;
    // Busca el vehículo que coincida con el id pasado por parámetro
    db.collection("vehicles")
        .find({ _id: vehicle._id })
        .toArray(function (err, vehicles) {
            // Si se produce un error envía un mensaje de error
            if (err != null) {
                console.log("Ha habido un error al buscar en createVehicle: ");
                console.log(err);
                res.send({ mensaje: "Ha habido un error al buscar en createVehicle: " + err });
                return;
            } else {
                // Si no encuentra ningún vehiculo con el mismo id lo inserta en la db
                if (vehicles.length === 0) {
                    db.collection("vehicles").insertOne(vehicle, function (err, respuesta) {
                        // Si se produce un error al intentar insertar el vehículo, devuelve un error
                        if (err != null) {
                            console.log("Ha habido un error al insertar en createVehicle: ");
                            console.log(err);
                            res.send({ mensaje: "Ha habido un error al insertar en createVehicle: " + err });
                            // Si no se produce error, inserta el vehículo en la db y envia mensaje de Vehículo creado correctamente.
                        } else {
                            console.log("Vehículo creado correctamente");
                            res.send({ mensaje: "Vehículo creado correctamente" });
                        }
                    });
                } else {
                    console.log("Ya existe un vehículo registrado con ese id")
                    res.send({ mensaje: "Ya existe un vehículo registrado con ese id" });
                }
            }
        });
});

//Método que muestra el vehículo de la base de datos que correponde al id pasado por parámetro
router.get("/viewVehicle/:_id", (req, res) => {
    const db = req.app.locals.db;
    const id = req.params._id;
    console.log(id);
    db.collection("vehicles")
        .find({ _id: id })
        .toArray(function (err, vehicles) {
            if (err != null) {
                console.log("Ha habido un error al buscar en la db: ");
                console.log(err);
                res.send({ mensaje: "Ha habido un error al buscar en la db: " + err });
                return;
            } else {
                // Si no encuentra ningún vehiculo con el mismo id lo inserta en la db
                if (vehicles.length != 0) {
                    console.log(vehicles[0])
                    res.send(vehicles[0]);
                } else {
                    res.send({ mensaje: "No existe ningún vehículo registrado con ese id" });
                }
            }
        });
});


// Método para editar el idLocalizador de un vehículo
router.put("/uploadVehicleId/:_id/:newId", (req, res) => {
    const db = req.app.locals.db;
    const id = req.params._id;
    const newId = req.params.newId;
  
    // Se busca el vehículo por su _id
    db.collection("vehicles").findOne({ _id: id }, function (err, vehicle) {
      if (err) {
        console.log("Ha habido un error al buscar el vehículo: ");
        console.log(err);
        res.send({ mensaje: "Ha habido un error al buscar el vehículo: " + err });
        return;
      }
  
      // Si no se encuentra ningún vehículo con ese _id, se envía un mensaje de error
      if (!vehicle) {
        console.log("No se ha encontrado ningún vehículo con ese _id");
        res.send({ mensaje: "No se ha encontrado ningún vehículo con ese _id" });
        return;
      }
  
      // Se actualiza el idLocalizador del vehículo con el nuevo valor
      vehicle.datosVehiculo.idLocalizador = newId;
  
      // Se actualiza el vehículo en la base de datos
      db.collection("vehicles").updateOne(
        { _id: id },
        { $set: vehicle },
        function (err, result) {
          if (err) {
            console.log("Ha habido un error al actualizar el vehículo: ");
            console.log(err);
            res.send({ mensaje: "Ha habido un error al actualizar el vehículo: " + err });
            return;
          }
  
          // Si todo ha ido bien, se envía un mensaje de éxito
          console.log(`El vehículo con _id ${id} se ha actualizado correctamente`);
          res.send({ mensaje: `El vehículo con _id ${id} se ha actualizado correctamente` });
        }
      );
    });
  });



// Método que elimina un vehículo de la base de datos que corresponde al _id pasado por parámetro
router.delete("/deleteVehicle/:_id", (req, res) => {
    const db = req.app.locals.db;
    const id = req.params._id;
  
    // Eliminamos el vehículo de la base de datos
    db.collection("vehicles").deleteOne({ _id: id }, function (err, result) {
      if (err != null) {
        console.log("Ha habido un error al eliminar el vehículo de la db: ");
        console.log(err);
        res.send({ mensaje: "Ha habido un error al eliminar el vehículo de la db: " + err });
      } else {
        // Comprobamos si se ha eliminado algún documento (result.deletedCount será mayor que 0)
        if (result.deletedCount === 0) {
          console.log("No se ha encontrado ningún vehículo con ese id");
          res.send({ mensaje: "No se ha encontrado ningún vehículo con ese id" });
        } else {
          console.log("Vehículo eliminado correctamente");
          res.send({ mensaje: "Vehículo eliminado correctamente" });
        }
      }
    });
  });

// Export

module.exports = router;