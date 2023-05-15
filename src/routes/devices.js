"use strict";

// Importaciones

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken } = require("../middleware/jwt");
const ObjectId = require('mongodb').ObjectId;
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

/**
 * La idea es buscar el vehiculo por la matricula, ver el id del dispositivo, y a travles del id hacer 
 * la peticion axios del dispositivo, recoger la fecha, longitud latitud y velocidad, para crear un objeto y devolverlo
 * por res.send 
 * TODO
 */

router.get("/actualPositionVehicleByMatricula/:matricula", async (req, res) => {
    const db = req.app.locals.db;
    const matricula = req.params.matricula;

    try {
        // Buscamos el vehículo por su matrícula en la colección "vehicles"
        const vehiculo = await db.collection("vehicles").findOne({ matricula });

        if (!vehiculo) {
            res.send({ mensaje: "No se encontró el vehículo." });
            return;
        }

        // Obtenemos el ID de dispositivo del vehículo encontrado
        const idDispositivo = vehiculo.idDispositivo;
        console.log();
        console.log("************************* ID del dispositivo: *************************", idDispositivo);

        // Buscamos el dispositivo por su ID en la colección "devices"
        const dispositivo = await db.collection("devices").findOne({ _id: ObjectId(idDispositivo) });
        console.log();
        console.log("************************* Dispositivo encontrado: *************************", dispositivo);

        if (!dispositivo) {
            res.send({ mensaje: "No se encontró el dispositivo." });
            return;
        }

        // Buscamos la última posición por su ID en la colección "positions" y la guardamos en una variable
        const ultimaPosicion = await db.collection("positions").findOne({ _id: ObjectId(dispositivo.posiciones[dispositivo.posiciones.length - 1]) });
        console.log();
        console.log("************************* Última posición: *************************", ultimaPosicion);

        // Almacenamos los datos de la consulta axios
        const response = await axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`);
        console.log("************************* Respuesta de la API: *************************", response.data.posts);

        // Buscar el dispositivo en la consulta axios con el ID deseado en el arreglo de respuesta
        const dispositivoAxios = response.data.posts.find((obj) => obj.id === dispositivo.idDispositivo);
        console.log();
        console.log(dispositivo.idDispositivo);
        console.log();
        console.log("************************* Response.data.posts: *************************");
        console.log(response.data.posts);
        console.log();
        console.log("************************* DispositivoAxios: *************************");
        console.log(dispositivoAxios);

        // Comprobamos si se encontró el dispositivo en la respuesta axios y si las latitudes y longitudes son distintas
        if (dispositivoAxios && (dispositivoAxios.lat /*!== ultimaPosicion.latitud || dispositivoAxios.lon !== ultimaPosicion.longitud*/)) {

            // Guardar el nuevo objeto en la colección "positions"
            const newPosition = {
                id: dispositivoAxios.id,
                latitud: dispositivoAxios.lat,
                longitud: dispositivoAxios.lon,
                velocidad: dispositivoAxios.speed,
                timestamp: dispositivoAxios.timestamp,
            };

            console.log();
            console.log("NewPosition: ");
            console.log(newPosition);
            
            console.log();
            console.log("Insertando nueva posicion en positions...");
            console.log();
            await db.collection("positions").insertOne(newPosition);

            console.log("************************* Posición insertada: *************************");

            // Actualizar el dispositivo en la base de datos con la nueva posición
            await db.collection("devices").updateOne({ _id: ObjectId(idDispositivo) }, { $push: { posiciones: newPosition._id } });

            console.log();
            console.log("************************* Nueva posición: *************************");
            console.log();
            console.log("NewPosition: ");
            console.log();
            console.log(newPosition);
            res.send(newPosition);
        } else {
            console.log("No se encontró un objeto con el ID deseado o las latitudes y longitudes no coinciden.");
            res.send({ mensaje: "No se encontró un objeto con el ID deseado o las latitudes y longitudes no coinciden." });
        }
    } catch (error) {
        console.error(error);
        res.send({ mensaje: "Ocurrió un error al procesar la solicitud." });
    }
});




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