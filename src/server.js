"use strict";

// Importaciones

const express = require('express');
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");


// Middleware

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


// BBDD

MongoClient.connect(process.env.DB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
        if (err != null) {
            console.log(`Error al conectar a la bbdd: ${err}`);
        } else {
            console.log("Conexión con la base de datos realizada correctamente");
            app.locals.db = client.db(process.env.DB_NAME);
        }
    });


// Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname);
    }
});
const upload = multer({ storage: storage });
app.use(upload.single("file")); // file es el key del objeto FormData.


// Routes

const contact = require("./routes/contact");
app.use("/api", contact);

const auth = require("./routes/auth");
app.use("/api", auth);

const users = require("./routes/users");
app.use("/api", users);

const vehicles = require("./routes/vehicles");
app.use("/api", vehicles);

const devices = require("./routes/devices");
app.use("/api", devices);

const positions = require("./routes/positions");
app.use("/api", positions)

const airFilterChange = require("./routes/airFilterChanges");
app.use("/api", airFilterChange);

const distributionChange = require("./routes/distributionChanges");
app.use("/api", distributionChange);

const fuelFilterChanges = require("./routes/fuelFilterChanges");
app.use("/api", fuelFilterChanges)

const maintenances = require("./routes/maintenances");
app.use("/api", maintenances)

const oilChanges = require("./routes/oilChanges");
app.use("/api", oilChanges)

const oilFilterChanges = require("./routes/oilFilterChanges");
app.use("/api", oilFilterChanges)

const pollenFilterChanges = require("./routes/pollenFilterChanges");
app.use("/api", pollenFilterChanges)




// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
