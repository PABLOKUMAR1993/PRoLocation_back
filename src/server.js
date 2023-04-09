// Import

const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");


// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// BBDD

MongoClient.connect(process.env.DB_URL,(err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : app.locals.db = client.db(process.env.DB_NAME);
});


// Routes

const devices = require("./routes/devices");
app.use("/api/devices", devices);


// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
