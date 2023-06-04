"use strict";

// Importaciones


const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3001 });
const axios = require('axios');
const { findPhisicalDeviceId } = require("./lib/utils");


// Peticiones de conexión


server.on( 'connection', ( socket ) => {

    console.log('Cliente Conectado');
    let position = {};

    // Enviar un mensaje al cliente cada 10 segundos.
    const inverval = setInterval( () => {
       socket.send( JSON.stringify( position ) );
    }, 1000 );

    // Mensajes recibidos desde el cliente.
    socket.on( 'message', async ( vehicle ) => {
       position = await verCoordenadas( vehicle );
    });

    // Cerrar la conexión con el cliente.
    socket.on( 'close', () => {
        console.log( 'Cliente desconectado.' );
        clearInterval( inverval ); // Detener el envío de mensajes.
    });

});

async function verCoordenadas( vehicle ) {

    let dataApi;
    let position;
    const vehicleParsed = JSON.parse(vehicle);

    // Recupero los datos de la API
    const resApi = await axios.get(
    'https://awsio.automaticaplus.es/awsGPStempsReal.php?user=tfgmadrid&password=qs_2023*FF8301CB'
    );
    dataApi = resApi.data.posts;

    // Recupero el dispositivo físico asociado al vehículo.
    const device = await findPhisicalDeviceId(vehicleParsed.idApi, dataApi);

    // Si el dispositivo no es null, creo un objeto posición y lo envío al front.
    if (device) {
        position = {
            id: device.id,
            latitud: device.lat,
            longitud: device.lon,
            velocidad: device.speed,
            timestamp: device.TimeStamp,
        };
    }

    // Envío la posición.
    return position;

}