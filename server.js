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
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const secret = 'mysecretkey';
const jwt = require('jsonwebtoken');


// BBDD

MongoClient.connect(process.env.DB_URL,{ useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : app.locals.db = client.db(process.env.DB_NAME);
});

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

////// JWT


/*
La propiedad jwtFromRequest utiliza la función fromAuthHeaderAsBearerToken() de la biblioteca jsonwebtoken 
para extraer el token JWT del encabezado Authorization en una solicitud HTTP. 
Esta es una de las formas más comunes de enviar tokens JWT en solicitudes HTTP.
La propiedad secretOrKey especifica la clave secreta utilizada para firmar y verificar los tokens JWT en la aplicación. 
La variable secret debe contener la clave secreta que se utilizará.
*/
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  };


function createToken(user) {
  const payload = {
    sub: user.id,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // Una semana
  };
  return jwt.sign(payload, secret);
}

// Uso de la función createToken
const user = { nombre: "raul", email: 'raul@gmail.com' };
const token = createToken(user);
console.log(token);
// Decodificar token utilizando jsonwebtoken
const decodedToken = jwt.decode(token);
// Mostrar contenido del token decodificado
console.log(decodedToken);


// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());
app.use(
    session({
        secret: "secret", // Es una cadena utilizada para firmar la cookie de sesión, lo que aumenta la seguridad.
        resave: false, //Indica si se debe volver a guardar la sesión en el almacenamiento de sesión incluso si la sesión no se ha modificado durante la solicitud.
        saveUnitialialized: false, //indica si se debe volver a guardar la sesión en el almacenamiento de sesión incluso si la sesión no se ha modificado durante la solicitud.
        cookie: {maxAge: 60000} // Configura la duración de la cookie de sesión se establece en 60000 milisegundos, que son 60 segundos (1 minuto).
    })
);
app.use(passport.initialize()); // Nos permite inicializar el cliente local de Passpot para indicar a Passport como identificar a los usuarios
app.use(passport.session());//Nos permite manejar las sesiones.

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    // Aquí se puede validar el JWT y buscar al usuario en la base de datos
      if (jwt_payload.sub === '1234567890') {
      console.log(jwt_payload.sub);
      return done(null, { id: '1234567890' });
    } else {
      return done(null, false);
    }
  }));

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







//const jwt = require('jsonwebtoken');
//const payload = { sub: '1234567890' };
//const token = jwt.sign(payload, secret);
//res.json({ token: token });

// REST de loggin

/*app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
      }
      // Si el usuario es autenticado correctamente, podrías crear un token JWT y enviarlo como respuesta al cliente.
      const token = createToken(user); // Crea un token JWT con la información del usuario.
      return res.json({ token });
    })(req, res, next);
  });*/

app.post("/api/login", passport.authenticate("local", {
    successRedirect: "/api",
    failureRedirect: "/api/fail"
}),function(req, res) {
    const payload = { sub: req.body.id };
    const token = jwt.sign(payload, secret);
    console.log(payload);
    console.log(secret);
    res.json({ token: token });
});

app.get("/api", (req, res) => {
    if (req.isAuthenticated() === false) {
        return res.status(401).send({ mensaje: "Necesitas loguearte" });
    } else {
        console.log(req.session);
        //return res.send(req.session);
        console.log("Token generado a través de /api: ");
        console.log(token);
        return res.send({ mensaje: "Logueado correctamente", token });
        
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
