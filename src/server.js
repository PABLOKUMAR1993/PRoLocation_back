"use strict";

// Importaciones

const express = require('express');
const app = express();
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const { connect, getDb } = require("./lib/db");

// Middleware

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


// MongoDB

function connectToDb() {
    const db = getDb();
    app.locals.db = db;
}

connect().then(() => { connectToDb(); });


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

const drivers = require("./routes/drivers");
app.use("/api", drivers)


// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});