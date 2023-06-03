"use strict"

// Importaciones

const { getDb } = require("./db");
const { ObjectId } = require('mongodb');
require("dotenv").config();

// Métodos

/**
 * Método que comprueba si un vehículo tiene un dispositivo físico asociado.
 * @param idVehicleApi El id del dispositivo físico que tiene el vehículo.
 * @param dataApiRes El array "posts" que devuelve la API de la empresa.
 * @returns El objeto del dispositivo físico asociado al vehículo.
 */
function findPhisicalDeviceId ( idVehicleApi, dataApiRes ) {
    let encontrado = false;
    for (const item of dataApiRes) {
        if (item.id === idVehicleApi) {
            encontrado = true;
            return item;
        }
    }
    if ( !encontrado ) return null;
}


/**
 * Método que busca un vehículo por su id.
 */
function findVehicleById( id ) {
    return getDb().collection("vehicles").findOne({ _id: ObjectId( id ) });
}

/**
 * Método que busca dispositivo por su idObject.
 */
function findDeviceByIdObject(id) {
    return getDb().collection("devices").findOne({ _id: ObjectId( id ) });
}

/**
 * Método que busca dispositivo por su id.
 */
 function findDeviceById(id) {
    return getDb().collection("devices").findOne({idDispositivo: id});
}

/**
 * Método que busca última posición.
 */
 function findLastPositionDevice(device) {
    return getDb().collection("positions").findOne({ _id: ObjectId( device.posiciones[device.posiciones.length - 1] ) });
}

/**
 * Método que inserta posición la base de datos.
 */
 function insertPosition(position) {
    return getDb().collection("positions").insertOne(position);
}


// Exportaciones

module.exports = {
    findPhisicalDeviceId,
    findVehicleById,
    findLastPositionDevice,
    findDeviceByIdObject,
    findDeviceById,
    insertPosition
}
