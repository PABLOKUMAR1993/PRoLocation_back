"use strict";

// Importaciones

const bcrypt = require("bcrypt");


// Métodos


/**
 * Encripto la contraseña del usuario y la devuelvo en el body.
 */
function bcryptEncrypt (req, res, next) {

    // Recupero el usuario del body.
    const user = req.body;
    // Encripto la contraseña.
    user.password = bcrypt.hashSync( user.password, 10 );
    // Devuelvo el usuario con la contraseña cifrada.
    req.body = user;
    // Continúo con el siguiente middleware o función.
    next();

}

/**
 * Comparo la contraseña encriptada con la contraseña en texto plano y devuelvo true o false.
 * @param passwordPlain Contraseña en texto plano, la que escribe el usuario.
 * @param passwordEncrypt Contraseña encriptada, la que está en la bbdd.
 * @return True si coinciden, false si no.
 */
function bcryptDecrypt( passwordPlain, passwordEncrypt ) {
    return bcrypt.compareSync( passwordPlain, passwordEncrypt );
}


// Exportación

module.exports = { bcryptEncrypt, bcryptDecrypt };