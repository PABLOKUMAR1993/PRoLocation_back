// Import

const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;


// BBDD

MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err != null) {
        console.log(`Error al conectar a la bbdd: ${err}`)
    } else {
        app.locals.db = client.db(process.env.DB_NAME);
        console.log("Conectado con éxito a la BBDD");
    }
});


// Routes

const devices = require("./routes/devices");
app.use("/api/devices", devices);


// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
