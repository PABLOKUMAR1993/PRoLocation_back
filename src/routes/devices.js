"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken }  = require("../middleware/jwt");
require("dotenv").config();


// Métodos Rest

/**
 * Método que devuelve la ubicación actual de los dos dispositivos.
 */
//router.get("/lastPositionOfAllDevices", verifyToken, async (req, res) => {
router.get("/lastPositionOfAllDevices", async (req, res) => {

    await axios.get(`${process.env.API_URL}?user=${process.env.API_USER}
    &password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`)
        .then(response => {
            console.log(response.data.posts);
            res.send(response.data.posts);
        })
        .catch(error => console.error(error));

});

// Método que devuelve la ubicación actual del dispositivo con la id del dispositivo pasado por parametros.
    router.get("/lastPositionDevicesId/:id", async (req, res) => {
        await axios.get(`${process.env.API_URL}?user=${process.env.API_USER}
        &password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`)
          .then(response => {
            console.log("Estoy despues de la consulta axios")
            // Obtenemos los datos de respuesta de la API
            const data = response.data;
            const device = data.posts.find(post => post.id === req.params.id);
            // Si no se encuentra ningún dispositivo con el "id" especificado, se envía una respuesta con un mensaje de error
            if (!device) {
              res.send('No se encontró ningún dispositivo con esa ID');
              return;
            }
            // Si se encuentra un dispositivo con el "id" especificado, enviar una respuesta con los datos del dispositivo
            /*console.log(`group: ${device.group}`);
            console.log(`idExternal: ${device.idExternal}`);
            console.log(`speed: ${device.speed}`);
            console.log(`lat: ${device.lat}`);
            console.log(`lon: ${device.lon}`);
            console.log(`TimeStamp: ${device.TimeStamp}`);
            console.log(`id: ${device.id}`);*/
            console.log(device);
            res.send(device);
          })
          .catch(error => console.error(error));
      });

// Devuelve los datos con las coordenadas del dispositivo de Raúl desde una fecha de 500 en 500.
router.get("/dataByDayIdLastFiveHundredRaul", (req, res) => {

    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}
    &dIni=2023-03-31%2000:10&id=${process.env.API_ID_RAUL}&metode=${process.env.API_METODE_DATE}`)
        .then(response => {
            console.log(response.data.posts);
            res.send(response.data.posts);
        })
        .catch(error => console.error(error));

});

// Devuelve los datos con las coordenadas del dispositivo de Pavlo desde una fecha de 500 en 500.
router.get("/dataByDayIdLastFiveHundredPavlo", (req, res) => {

    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}
    &dIni=2023-03-31%2000:10&id=${process.env.API_ID_RAUL}&metode=${process.env.API_METODE_DATE}`)
        .then(response => {
            console.log(response.data.posts);
            res.send(response.data.posts);
        })
        .catch(error => console.error(error));

});

// Método para almacenar en la BBDD los datos recibidos de los gpg. 
router.get("/saveDataAllDevice", (req, res) => {

    const db = req.app.locals.db;
    // Se hace la petición a la api para traer los datos de todos los dispositivos
    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}`)
        .then(response => {
            // Se almacenan los dispositivos
            let dispositivos = response.data;
            // Se muestran dispositivos en consola
            console.log(response.data.posts);
            //Se guardan los dispositivos en la base de datos
            db.collection("devices").insertOne(dispositivos, function (err, respuesta) {
                    if (err != null) {
                        console.log("Ha habido un error: ");
                        console.log(err);
                        res.send({mensaje: "Ha habido un error: " + err});
                    } else {
                        // Si el proceso es correcto muestra por consola y envia los dispositivos
                        console.log("Los datos de los dispositivos se han guardado en la BBDD correctamente");
                        res.send({
                            mensaje: "Los datos de los dispositivos se han guardados en la BBDD correctamente: ",
                            dispositivos
                        });
                    }
                }
            );
        }).catch(error => console.error(error));

});


// Método para almacenar en la BBDD los datos recibidos del gps de Raúl desde una fecha de 500 en 500.
router.get("/saveDataByDayIdLastFiveHundredRaul", (req, res) => {

    const db = req.app.locals.db;
    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&dIni=2023-03-31%2000:10&id=${process.env.API_ID_PAUL}&metode=${process.env.API_METODE_DATE}`)
        .then(response => {
            let dispositivos = response.data;
            console.log(response.data.posts);
            db.collection("devices").insertOne(dispositivos, function (err, respuesta) {
                    if (err != null) {
                        console.log("Ha habido un error: ");
                        console.log(err);
                        res.send({mensaje: "Ha habido un error: " + err});
                    } else {
                        console.log("Los datos de los dispositivos se han guardado en la BBDD correctamente");
                        res.send({
                            mensaje: "Los datos de los dispositivos se han guardados en la BBDD correctamente: ",
                            dispositivos
                        });
                    }
                }
            );
        }).catch(error => console.error(error));

});


// Método para almacenar en la BBDD los datos recibidos del gps de Pavlo desde una fecha de 500 en 500.
router.get("/saveDataByDayIdLastFiveHundredPavlo", (req, res) => {

    const db = req.app.locals.db;
    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&dIni=2023-03-31%2000:10&id=${process.env.API_ID_PAVLO}&metode=${process.env.API_METODE_DATE}`)
        .then(response => {
            let dispositivos = response.data;
            console.log(response.data.posts);
            db.collection("devices").insertOne(dispositivos, function (err, respuesta) {
                    if (err != null) {
                        console.log("Ha habido un error: ");
                        console.log(err);
                        res.send({mensaje: "Ha habido un error: " + err});
                    } else {
                        console.log("Los datos de los dispositivos se han guardado en la BBDD correctamente");
                        res.send({
                            mensaje: "Los datos de los dispositivos se han guardados en la BBDD correctamente: ",
                            dispositivos
                        });
                    }
                }
            );
        }).catch(error => console.error(error));

});


// Export

module.exports = router;