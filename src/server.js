"use strict";

// Importaciones

const express = require('express');
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
//const multer = require("multer");

//Middleware

app.use(express.urlencoded({extended: false}));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(express.json());

// BBDD

MongoClient.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if (err != null) {
            console.log(`Error al conectar a la bbdd: ${err}`);
        } else {
            console.log("Conexión con la base de datos realizada correctamente");
            app.locals.db = client.db(process.env.DB_NAME);
        }
    });


// Multer

/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/src/uploads"); // Dónde se guardará
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname); // Fecha actual + nombre original (evita duplicidad).
    }
});*/


// Routes

const contact = require("./routes/contact");
app.use("/api", contact);

const register = require("./routes/auth");
app.use("/api", register);

const users = require("./routes/users");
app.use("/api", users);

const vehicles = require("./routes/vehicles");
app.use("/api", vehicles);

const devices = require("./routes/devices");
app.use("/api", devices);



// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
