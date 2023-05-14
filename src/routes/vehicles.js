"use strict";
// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

//Añadir vehículo
//Método que crea un nuevo vehículo en la base de datos
router.post("/createVehicle", (req, res) => {
  const db = req.app.locals.db;
  const vehicle = req.body;
  // Busca el vehículo que coincida con la matricula pasado por parámetro
  db.collection("vehicles")
    .find({ matricula: vehicle.matricula })
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
          console.log("Ya existe un vehículo registrado con esa maricula")
          res.send({ mensaje: "Ya existe un vehículo registrado con esa maricula" });
        }
      }
    });
});

//Método que añade un dispositivo a un vehículo
router.post('/addDeviceToVehicle', async function (req, res) {
  // Obtener la instancia de la base de datos desde el objeto "req.app.locals"
  const db = req.app.locals.db;

  try {
    // Obtener la matrícula del vehículo y el id del dispositivo desde los parámetros de la URL
    const matricula = req.body.matricula;
    const idDispositivo = req.body.idDispositivo;

    // Buscar el vehículo por su matrícula en la colección "vehiculos" de la base de datos
    const vehiculo = await db.collection('vehicles').findOne({ matricula });
    console.log(vehiculo);

    // Si el vehículo no se encuentra, devolver un mensaje de error y un estado 404
    if (!vehiculo) {
      res.status(404).json({ mensaje: 'Vehículo no encontrado' });
      return;
    }
    // Buscar el dispositivo por su matrícula en la colección "devices" de la base de datos
    const dispositivo = await db.collection('devices').findOne({ idDispositivo });
    // Si el vehículo no se encuentra, devolver un mensaje de error y un estado 404
    if (!dispositivo) {
      res.status(404).json({ mensaje: 'Dispositivo no encontrado' });
      return;
    }
    // Comprobar si el dispositivo ya está en la lista de dispositivos del vehículo
    if (vehiculo.idDispositivo) {
      if (vehiculo.idDispositivo === dispositivo._id) {
        res.status(409).json({ mensaje: 'El dispositivo ya está asociado al vehículo' });
        // Actualizar el vehículo en la base de datos con la lista de dispositivos actualizada
      } else {
        await db.collection('vehicles').updateOne({ matricula }, { $set: { idDispositivo: dispositivo._id } });
      }
    } else {
      // Si está vacío.
      await db.collection('vehicles').updateOne({ matricula }, { $set: { idDispositivo: dispositivo._id } });
    }
    // Devolver el vehículo actualizado como respuesta
    res.send(vehiculo);
  } catch (error) {
    // Si ocurre un error al buscar el vehículo o al actualizar la base de datos, devolver un mensaje de error y un estado 500
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


//Método que muestra todos los vehículos de la base de datos
router.get("/viewAllVehicles", (req, res) => {
  const db = req.app.locals.db;
  db.collection("vehicles")
    .find({})
    .toArray(function (err, vehicles) {
      if (err != null) {
        console.log("Ha habido un error al buscar en la db: ");
        console.log(err);
        res.send({ mensaje: "Ha habido un error al buscar en la db: " + err });
        return;
      } else {
        // Si no encuentra ningún vehiculo con el mismo id lo inserta en la db
        if (vehicles.length != 0) {
          console.log(vehicles)
          res.send(vehicles);
        } else {
          res.send({ mensaje: "No existen vehículos registrados" });
        }
      }
    });
});


//Método que muestra el vehículo de la base de datos que correponde a la matricula pasado por parámetro
router.get("/viewVehicleByMatricula/:matricula", (req, res) => {
  const db = req.app.locals.db;
  const matricula = req.params.matricula;
  console.log(matricula);
  db.collection("vehicles")
    .find({ matricula: matricula })
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
          res.send({ mensaje: "No existe ningún vehículo registrado con esa matricula" });
        }
      }
    });
});

//Método que muestra los vehiculos asignados a un usuario pasando su email
router.get("/viewVehiclesUser/:email", (req, res) => {
  const db = req.app.locals.db;
  const email = req.params.email;

  // Buscamos el usuario por su email en la colección "users"
  db.collection("users")
    .find({ email: email })
    .toArray(function (err, result) {
      if (err != null) {
        console.log("Ha habido un error al buscar en la db: ");
        console.log(err);

        // Si ocurre un error, enviamos un mensaje de error al cliente
        res.send({ mensaje: "Ha habido un error al buscar en la db: " + err });
        return;
      } else {

        // Si encontramos el usuario y tiene vehículos, procedemos a buscar los vehículos
        if (result.length != 0 && result[0].vehiculos) {

          // Extraemos los IDs de los vehículos en un array "vehiculosIds"
          const vehiculosIds = result[0].vehiculos;

          // Usamos la función "find()" en la colección "vehiculos" para buscar todos los documentos
          // cuyo "_id" se encuentre en el array "vehiculosIds"
          db.collection("vehicles")
            .find({ _id: { $in: vehiculosIds } })
            .toArray(function (err, vehiculos) {
              if (err != null) {
                console.log("Ha habido un error al buscar en la db: ");
                console.log(err);

                // Si ocurre un error, enviamos un mensaje de error al cliente
                res.send({ mensaje: "Ha habido un error al buscar en la db: " + err });
                return;
              } else {

                // Si encontramos los vehículos, enviamos la información de los mismos al cliente
                if (vehiculos.length != 0) {
                  console.log(vehiculos);
                  res.send(vehiculos.map(vehiculo => {
                    return { ...vehiculo };
                  }));
                } else {

                  // Si no encontramos vehículos, enviamos un mensaje al cliente
                  res.send({ mensaje: "No se encontraron vehículos para este usuario" });
                }
              }
            });
        } else {

          // Si no encontramos vehículos, enviamos un mensaje al cliente
          res.send({ mensaje: "No se encontraron vehículos para este usuario" });
        }
      }
    });
});

//Método que la posición de un vehiculo pasando su id 
router.get("/viewLastPositionVehicle/:idVehiculo", async (req, res) => {
  const db = req.app.locals.db;
  const idVehiculo = req.params.idVehiculo;

  // Expresión regular para validar una cadena de 24 caracteres hexadecimales
  const idPosicionRegExp = /^[0-9a-fA-F]{24}$/;

  // Comprobamos si el idVehiculo no es una cadena de 24 caracteres hexadecimales válida, en cuyo caso retornamos un error 400.
  if (typeof idVehiculo !== 'string' || !idPosicionRegExp.test(idVehiculo)) {
    return res.status(400).json({ mensaje: 'El idVehiculo no tiene el formato correcto.' });
  }

  try {
    // Buscamos el vehículo por su "_id" en la colección "vehicles".
    const vehiculo = await db.collection("vehicles").findOne({ _id: ObjectId(idVehiculo) });
    console.log(vehiculo);

    // Si no se encontró el vehículo, retornamos un error 404.
    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'No se encontró el vehículo.' });
    }

    // Buscamos el dispositivo asociado al vehículo en la colección "devices".
    const dispositivo = await db.collection("devices").findOne({ _id: ObjectId(vehiculo.idDispositivo) });
    console.log(dispositivo);

    // Si no se encontró el dispositivo, retornamos un error 404.
    if (!dispositivo) {
      return res.status(404).json({ mensaje: 'No se encontró el dispositivo asociado al vehículo.' });
    }

    // Obtenemos la última posición del dispositivo.
    const ultimaPosicion = dispositivo.posiciones[ dispositivo.posiciones.length - 1 ];

    // Convertimos el id de la posición a un objeto ObjectId.
    const objectIdPosicion = ObjectId(ultimaPosicion);

    // Buscamos la posición en la colección "positions" utilizando el objectIdPosicion.
    const posicion = await db.collection("positions").findOne({ _id: objectIdPosicion });

    // Si no se encontró la posición, retornamos un error 404.
    if (!posicion) {
      return res.status(404).json({ mensaje: 'No se encontró la posición del dispositivo.' });
    }

    // Si todo ha ido bien, devolvemos la posición.
    console.log(posicion);
    res.send(posicion);
  } catch (error) {
    // Si se produce un error en la base de datos, retornamos un error 500 con el mensaje de error.
    res.status(500).json({ mensaje: 'Error en la base de datos.', error });
  }
});

//Método para asignar dispositivo al vehículo
router.post("/addDeviceToVehicle", (req, res) => {
  const db = req.app.locals.db;
  const matricula = req.body.matricula;
  const idDevice = req.body.idDevice;

  db.collection("devices").findOne({ _id: ObjectId(idDevice) }, function (err, dispositivo) {
    if (err) {
      console.log("Ha habido un error al buscar el dispositivo: ");
      console.log(err);
      res.send({ mensaje: "Ha habido un error al buscar el dispositivo: " + err });
      return;
    }

    if (!dispositivo) {
      console.log("No se encontró un dispositivo con el ID: " + idDevice);
      res.send({ mensaje: "No se encontró un dispositivo con el ID: " + idDevice });
      return;
    }

    db.collection("vehicles").updateOne(
      { matricula: matricula },
      { $push: { dispositivo: dispositivo } },
      function (err, result) {
        if (err != null) {
          console.log("Ha habido un error al actualizar el vehículo: ");
          console.log(err);
          res.send({ mensaje: "Ha habido un error al actualizar el vehículo: " + err });
          return;
        } else {
          console.log("Dispositivo agregado con éxito al vehículo con matrícula: " + matricula);
          res.send({ mensaje: "Dispositivo agregado con éxito al vehículo con matrícula: " + matricula });
        }
      }
    );
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