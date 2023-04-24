// Import

const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session")
const bcrypt = require("bcrypt");

////// multer

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dónde se guardará
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + " - " + file.originalname); // Fecha actual + nombre original (evita duplicidad).
    }
});
const upload = multer({ storage: storage });

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUnitialialized: false
    })
);
app.use(passport.initialize()); // Nos permite inicializar el cliente local de Passpot para indicar a Passport como identificar a los usuarios
app.use(passport.session());//Nos permite manejar las sesiones.

// BBDD

MongoClient.connect(process.env.DB_URL,{ useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : app.locals.db = client.db(process.env.DB_NAME);
});

// Comprobamos si el usuario existe y la contraseña es correcta.
passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        function (email, password, done) {
            app.locals.db.collection("users")
                .find({ email: email })
                .toArray((err, users) => {
                    if (users.length === 0) {
                        return done(null, false)
                    }
                    const user = users[0];
                    if (bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
        }));

// Creamos la sesión
passport.serializeUser((user, done) => {
    done(null, user.email);
});

// Destruimos la sesión
passport.deserializeUser((id, done) => {
    app.locals.db.collection("users").find({ email: id })
        .toArray((err, users) => {
            if (users.length === 0) done(null, null);
            else done(null, users[0]);
        });
});

// REST de loggin
app.post("/api/login", passport.authenticate("local", {
    successRedirect: "/api",
    failureRedirect: "/api/fail"
}));

app.get("/api", (req, res) => {
    if (req.isAuthenticated() === false) {
        return res.status(401).send({ mensaje: "Necesitas loguearte" });
    } else {
        console.log(req.session);
        return res.send({ mensaje: "Logueado correctamente" });
    }
});

app.get("/api/fail", (req, res) => {
    res.status(401).send({ mensaje: "Denegado, usuario o contraseña incorrectos" });
});

app.put("/api/logout", function (req, res) {
    console.log(req.session);
    req.session.destroy(function (err) {
        res.send({ mensaje: "Logout realizado correctamente" });
    })
    console.log(req.session);
});

// Routes

const devices = require("./routes/devices");
app.use("/api/devices", devices);

const contact = require("./routes/contact");
app.use("/api", contact);

const register = require("./routes/register");
app.use("/api", register);


// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
