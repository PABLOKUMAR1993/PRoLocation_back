"use strict";
// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();


/**
 * Insertar vehículo en el array vehículos de un usuario
 */

// Metodo para agregar un vehículo a un usuario
router.get('/addVehicleToUser/:email/:matricula', async function(req, res) {
    // Obtener la instancia de la base de datos desde el objeto "req.app.locals"
    const db = req.app.locals.db;
  
    try {
      // Obtener el correo electrónico del usuario y la matrícula del vehículo desde los parámetros de la URL
      const email = req.params.email;
      const matricula = req.params.matricula;
  
      // Obtener el usuario por su correo electrónico desde la colección "usuarios" de la base de datos
      const usuario = await db.collection('users').findOne({ email });
  
      // Si el usuario no se encuentra, devolver un mensaje de error y un estado 404
      if (!usuario) {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
        return;
      }
  
      // Buscar el vehículo por su matrícula en la colección "vehiculos" de la base de datos
      const vehiculo = await db.collection('vehicles').findOne({ matricula });
  
      // Si el vehículo no se encuentra, devolver un mensaje de error y un estado 404
      if (!vehiculo) {
        res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        return;
      }
  
      // Comprobar si el vehículo ya está en la lista de vehículos del usuario
      const vehiculoExistente = usuario.vehiculos.find(v => v.matricula === matricula);
  
      if (vehiculoExistente) {
        // Si el vehículo ya está en la lista de vehículos del usuario, devolver un mensaje de error y un estado 409
        res.status(409).json({ mensaje: 'El vehículo ya está asociado al usuario' });
        return;
      } else {
        // Si el vehículo no está en la lista de vehículos del usuario, agregar una referencia al vehículo en la lista de vehículos del usuario
        usuario.vehiculos.push({ matricula, vehiculoId: vehiculo._id });
  
        // Actualizar el usuario en la base de datos con la lista de vehículos actualizada
        await db.collection('users').updateOne({ email }, { $set: { vehiculos: usuario.vehiculos } });
  
        // Devolver el usuario actualizado como respuesta en formato JSON
        res.json(usuario);
      }
    } catch (error) {
      // Si ocurre un error al buscar el usuario o al actualizar la base de datos, devolver un mensaje de error y un estado 500
      console.error(error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });
  
  
  

//Añadir usuario
//Método que crea un nuevo usuario en la base de datos
router.post("/createUser2", (req, res) => {
    const db = req.app.locals.db;
    const user = req.body;
    // Busca el usuario que coincida con el email pasado por parámetro
    db.collection("users")
        .find({ email: user.email })
        .toArray(function (err, users) {
            // Si se produce un error envía un mensaje de error
            if (err != null) {
                console.log("Ha habido un error al buscar en createUser: ");
                console.log(err);
                res.send({ mensaje: "Ha habido un error al buscar en createUser: " + err });
                return;
            } else {
                // Si no encuentra ningún usuario con el mismo email lo inserta en la db
                if (users.length === 0) {
                    db.collection("users").insertOne(user, function (err, respuesta) {
                        // Si se produce un error al intentar insertar el usuario, devuelve un error
                        if (err != null) {
                            console.log("Ha habido un error al insertar en createUser: ");
                            console.log(err);
                            res.send({ mensaje: "Ha habido un error al insertar en createUser: " + err });
                            // Si no se produce error, inserta el usuario en la db y envia mensaje de Vehículo creado correctamente.
                        } else {
                            console.log("Usuario creado correctamente");
                            res.send({ mensaje: "Usuario creado correctamente" });
                        }
                    });
                } else {
                    console.log("Ya existe un Usuario registrado con ese email")
                    res.send({ mensaje: "Ya existe un Usuario registrado con ese email" });
                }
            }
        });
});



// Export

module.exports = router;