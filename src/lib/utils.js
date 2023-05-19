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


// Exportaciones

module.exports = {
    findPhisicalDeviceId,
    findVehicleById
}
