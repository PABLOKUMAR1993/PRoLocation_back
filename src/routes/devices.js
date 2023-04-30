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
router.get("/lastPositionOfAllDevices", verifyToken, async (req, res) => {

    await axios.get(`${process.env.API_URL}?user=${process.env.API_USER}
    &password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`)
        .then(response => {
            console.log(response.data.posts);
            res.send(response.data.posts);
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
    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}`)
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