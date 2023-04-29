const express = require('express');
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session")
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const keys = require('./src/config/keys');
const multer = require("multer");

app.set('key', keys.key);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    session({
        secret: "secret", // Es una cadena utilizada para firmar la cookie de sesión, lo que aumenta la seguridad.
        resave: false, //Indica si se debe volver a guardar la sesión en el almacenamiento de sesión incluso si la sesión no se ha modificado durante la solicitud.
        saveUnitialialized: false, //indica si se debe volver a guardar la sesión en el almacenamiento de sesión incluso si la sesión no se ha modificado durante la solicitud.
        cookie: { maxAge: 60000 } // Configura la duración de la cookie de sesión se establece en 60000 milisegundos, que son 60 segundos (1 minuto).
    })
);
app.use(passport.initialize()); // Nos permite inicializar el cliente local de Passpot para indicar a Passport como identificar a los usuarios
app.use(passport.session());//Nos permite manejar las sesiones.

// BBDD

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : console.log("Conexión con la base de datos reralizada correctamente"), app.locals.db = client.db(process.env.DB_NAME);
});

////// multer
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

const secret = 'mysecretkey';
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

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

passport.use(new JwtStrategy(options, function (jwt_payload, done) {
    // Aquí se puede validar el JWT y buscar al usuario en la base de datos
    if (jwt_payload.sub === '1234567890') {
        console.log(jwt_payload.sub);
        return done(null, { id: '1234567890' });
    } else {
        return done(null, false);
    }
}));

//Estrategia de autenticación local
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


app.get('/saludo', (req, res) => {
    res.send('Hola Mundo');
})

// LOGIN

app.post("/login", passport.authenticate("local", {
    successRedirect: "/api",
    failureRedirect: "/api/fail"
}), function (req, res) {
    console.log("Hola desde login");
    //const payload = { sub: req.body.id };
    const payload = {
        check: true,
        sub: req.user.id,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // Una semana
    };
    const token = jwt.sign(payload, secret);
    console.log(payload);
    console.log(secret);
    console.log(token)
    res.json({
        menssge: '¡AUTENTICACIÓN EXITOSA!',
        token: token
    });
});

app.post('/loginNew', (req, res) => {
    const user = req.body;
    if (user.username == 'mortadelo' && user.password == '1234') {
        const payload = {
            check: true,
            sub: user.id,
            iat: Date.now(),
            exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // Una semana
        };
        const token = jwt.sign(payload, app.get('key'));
        console.log(token)
        res.json({
            menssge: '¡AUTENTICACIÓN EXITOSA!',
            token: token
        });

    } else {
        res.send('Usuario o Password incorrecto');
    }

})

app.post('/logoutNew', (req, res) => {
    // Eliminar el token actual del usuario en el servidor o en la base de datos
    // Eliminar el token del almacenamiento local del navegador
    req.localStorage.removeItem('token');

    // Redirigir al usuario a la página de inicio de sesión después de eliminar el token
    window.location.href = '/loginNew';
    res.send('Logout exitoso');
});

const verificacion = express.Router();

verificacion.use((req, res, next) => {

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log("req.headers: ")
    console.log(req.headers)
    console.log("Token: ")
    console.log(token)
    if (!token) {
        res.status(401).send({
            error: 'Es necesario un token de autenticación'
        })
        return
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
        console.log(token)
    }
    if (token) {
        jwt.verify(token, app.get('key'), (error, decoded) => {
            if (error) {
                return res.json({
                    menssge: "El token no es válido"
                });
            } else {
                req.decoded = decoded;
                next();
            }
        })
    }

})

app.get('/info', verificacion, (req, res) => {
    res.json('INFORMACION IMPORTANTE ENTREGADA')
})



// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
