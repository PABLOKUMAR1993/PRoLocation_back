"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken } = require("../middleware/jwt");
const { ObjectId } = require('mongodb');
const { findPhisicalDeviceId, findVehicleById } = require("../lib/utils");
require("dotenv").config();


// Métodos Rest

//Método para crear un dispositivo
router.post("/createDevice", (req, res) => {
    const db = req.app.locals.db;
    const device = req.body;

    db.collection("devices").insertOne(device, function (err, respuesta) {

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

// Método que devuelve la ubicación actual de todos dispositivos.

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

            console.log(device);
            res.send(device);
        })
        .catch(error => console.error(error));
});

// Método que devuelve la ubicación actual del dispositivo con la matricula del vehiculo pasado por parametros.

router.get( '/actualPositionVehicleById/:idVehiculo', async ( req, res ) => {

    // Recupero los datos de la API
    const resApi = await axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`);
    const dataApi = resApi.data.posts;

    // Busco el vehículo.
    const vehicle = await findVehicleById( req.params.idVehiculo );

    // Recupero el dispositivo físico asociado al vehículo.
    const device = findPhisicalDeviceId( vehicle.idApi, dataApi );

    // Si el dispositivo no es null, creo un objeto posición y la envío al front.
    if ( device ) {
        const position = {
            _id: "",
            id: device.id,
            latitud: device.lat,
            longitud: device.lon,
            velocidad: device.speed,
            timestamp: device.TimeStamp,
        };
        res.status(200).send( position );
        continuar( position );
    } else {
        res.status(404).send( { mensaje: "No se encontró el dispositivo." } );
    }

});


/**
 * La idea es buscar el vehiculo por la matricula, ver el id del dispositivo, y a través del id hacer
 * la petición axios del dispositivo, recoger la fecha, longitud latitud y velocidad, para crear un objeto y devolverlo
 * por res.send 
 * TODO
 */
// router.get("/actualPositionVehicleById/:id", async (req, res) => {
//
//     try {
//         const db = req.app.locals.db;
//         const idVehiculo = req.params.id;
//
//         // Buscamos el vehículo por su id en la colección "vehicles"
//         const vehiculo = await db.collection("vehicles").findOne({ _id: ObjectId( idVehiculo ) });
//         if (!vehiculo) return res.status(404).send({ mensaje: "No se encontró el vehículo." });
//
//         // Buscamos el dispositivo por su ID en la colección "devices"
//         const dispositivo = await db.collection("devices").findOne({ _id: ObjectId(vehiculo.idDispositivo) });
//         if (!dispositivo) return res.status(404).send({ mensaje: "No se encontró el dispositivo." });
//
//         // Obtenemos el ID de la última posición del dispositivo
//         if ( dispositivo.posiciones.length === 0 ) return res.status(404).send({ mensaje: "No hay posiciones en el dispositivo." });
//
//         // Buscamos la última posición por su ID en la colección "positions"
//         const ultimaPosicion = await db.collection("positions").findOne({ _id: ObjectId( dispositivo.posiciones[dispositivo.posiciones.length - 1] ) });
//
//         // Recuperamos las últimas posiciones de todos los dispositivos.
//         const responseAxios = await axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`);
//
//         // Buscamos el dispositivo en la respuesta de la API utilizando su ID
//         const dispositivoAxios = responseAxios.data.posts.find( (obj) => obj.id === dispositivo.idDispositivo );
//         if (!dispositivoAxios) return res.status(404).send({ mensaje: "El dispositivo no se ha encontrado en axios." });
//
//         // Comprobamos si las coordenadas de la última posición del dispositivo son diferentes a las de la nueva posición.
//         if (dispositivoAxios.lat !== ultimaPosicion.latitud && dispositivoAxios.lon !== ultimaPosicion.longitud) {
//             // Creamos un objeto con los datos de la nueva posición
//             const newPosition = {
//                 id: dispositivoAxios.id,
//                 latitud: dispositivoAxios.lat,
//                 longitud: dispositivoAxios.lon,
//                 velocidad: dispositivoAxios.speed,
//                 timestamp: dispositivoAxios.TimeStamp,
//             };
//
//             // Insertamos la nueva posición en la colección "positions"
//             await db.collection("positions").insertOne( newPosition );
//
//             // Actualizamos el dispositivo en la base de datos con la nueva posición
//             await db.collection("devices").updateOne({ _id: ObjectId( dispositivo.idDispositivo ) }, { $push: { posiciones: newPosition._id } });
//
//             console.log("Las coordenadas no coinciden y se ha creado una nueva positions.");
//             return res.status(200).send(newPosition);
//         } else {
//             const position = {
//                 _id: "",
//                 id: dispositivoAxios.id,
//                 latitud: dispositivoAxios.lat,
//                 longitud: dispositivoAxios.lon,
//                 velocidad: dispositivoAxios.speed,
//                 timestamp: dispositivoAxios.TimeStamp,
//             };
//
//             console.log("Las coordenadas coinciden y no se ha insertado en la colección positions.");
//             return res.status(200).send( position );
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ mensaje: "Ocurrió un error al procesar la solicitud.", error: error });
//     }
// });



// Devuelve los datos con las coordenadas del dispositivo pasado por parametro desde una fecha y hora pasadas por parametros de 500 en 500.
router.get("/dataByDayIdLastFiveHundredRaul/:id/:fecha/:hora", (req, res) => {
    const idDevice = req.params.id; console.log("Id device: " + idDevice);
    const fecha = req.params.fecha; console.log("Año: " + fecha);
    const hora = req.params.hora; console.log("Hora: " + hora);
    axios.get(`https://awsio.automaticaplus.es/awsGPStempsReal.php?user=tfgmadrid&password=qs_2023*FF8301CB&dIni=${fecha}%2000:${hora}&id=${idDevice}&metode=recuperaDesDeData`)
        .then(response => {
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
router.post("/saveDataAllDevice", (req, res) => {

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
                    res.send({ mensaje: "Ha habido un error: " + err });
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
                    res.send({ mensaje: "Ha habido un error: " + err });
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
                    res.send({ mensaje: "Ha habido un error: " + err });
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

/**
 * Método que reciba los datos de un dispositivo y añada los campos idDispositivo, longitud, latitud y velocidad a la base de datos posicion. 
 */

router.get("/addPosition", (req, res) => {

    // Conexión a la base de datos
    const db = req.app.locals.db;

    // Obtenemos de los dispositivos desde la API externa
    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&dIni=2023-03-31%2000:10&id=${process.env.API_ID_PAVLO}&metode=${process.env.API_METODE_DATE}`)
        .then(response => {
            // Obtenemos las posiciones de los dispositivos y creación de un objeto para cada dispositivo con su id y su posición
            let devices = response.data;
            let positions = devices.posts.map(device => {
                return {
                    idDevice: device.id,
                    longitud: device.longitude,
                    latitud: device.latitude,
                    speed: device.speed
                }
            });

            // Inserción de las posiciones en la colección "position" de la base de datos
            db.collection("position").insertMany(positions, function (err, respuesta) {
                if (err != null) {
                    console.log("Ha habido un error: ");
                    console.log(err);
                    res.send({ mensaje: "Ha habido un error: " + err });
                } else {
                    console.log("Los datos de los dispositivos se han guardado en la BBDD correctamente");

                    // Devolución de un objeto con el mensaje de éxito y el array de posiciones de los dispositivos
                    res.send({
                        mensaje: "Los datos de los dispositivos se han guardados en la BBDD correctamente: ",
                        positions
                    });
                }
            });
        }).catch(error => console.error(error));
});

//1. Necesito que me lleguen los datos del dispositivo que le pase la id por parametro 

//2. Buscar el dispositivo en la base de datos por el id recibido y guarde en el array posición los campos longitud, latitud y velocidad



// Export

module.exports = router;
