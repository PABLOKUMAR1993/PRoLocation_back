const express = require('express');
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const multer = require("multer");


//Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// BBDD

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : console.log("Conexión con la base de datos reralizada correctamente"), app.locals.db = client.db(process.env.DB_NAME);
});

// Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dónde se guardará
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname); // Fecha actual + nombre original (evita duplicidad).
    }
});
const upload = multer({ storage: storage });

// Routes

const devices = require("./src/routes/devices");
app.use("/api/devices", devices);

const contact = require("./src/routes/contact");
app.use("/api", contact);

const register = require("./src/routes/register");
app.use("/api", register);

// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
