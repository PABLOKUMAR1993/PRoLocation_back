"use strict";


// Importaciones

const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();


// Métodos

let db;
function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect( process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
                if (err != null) {
                    console.log(`Error al conectar a la bbdd: ${err}`);
                    reject(err);
                } else {
                    console.log("Conexión con la base de datos realizada correctamente");
                    db = client.db(process.env.DB_NAME);
                    resolve();
                }
            }
        );
    });
}


// Exportación

module.exports = {
    connect,
    getDb: () => db
};