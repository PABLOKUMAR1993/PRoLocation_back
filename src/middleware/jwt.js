"use strict";

// importaciones

const jwt = require("jsonwebtoken");
const UNAUTHORIZED_ERROR = "No tienes permiso para ver este contenido.";
require("dotenv").config();


// Métodos

/**
 * Método para comprobar si el token recibido se puede decodificar con la clave secreta.
 */
function verifyToken( req, res, next ) {

    // Almaceno el token si llega en la cabecera.
    const token = req.headers.authorization?.split( " " )[1] || null;

    // Si no llega valor, devuelvo error.
    if ( !token ) return next( new Error( UNAUTHORIZED_ERROR ) );

    try {
        // Si es válido, lo decodifico y lo almaceno en req.userId.
        const payload = jwt.verify( token, process.env.JWT_SECRET_KEY );
        req.userLogged = JSON.stringify(payload);
        console.log( "payload" + req.userLogged );
        next();
    } catch ( error ) {
        // Si no es válido, devuelvo error.
        return next(new Error(UNAUTHORIZED_ERROR));
    }

}

/**
 * Método para generar un token en el login.
 */
function generateToken( user ) {
    console.log( "generateToken: " + JSON.stringify(user) );
    // Relaciono el usuario entero con el token. 86400 segundos equivale a 24 horas.
    return jwt.sign( user, process.env.JWT_SECRET_KEY, { expiresIn: 86400 } );
}


// Exportaciones

module.exports = { verifyToken, generateToken };