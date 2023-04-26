// Import

const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
//const mongoose = require('mongoose');
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const jwt = require("./jwt")
//const mongooseUser = require("../models/user");
const auth = require("./config/auth")

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

//Estrategia local de Passport
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Por defecto, Passport espera un campo 'username', pero en este caso se utiliza 'email' como nombre de usuario
    (email, password, done) => {
    const db = app.locals.db;
      // Aquí debes verificar que las credenciales del usuario son correctas, por ejemplo, consultando una base de datos
      console.log("Verificando credenciales usuario...")
      db.collection("users").findOne({ email }, (err, user) => {
        if (err) { 
            return done({message: "error: ", err}); 
        }
        if (!user) { 
            return done(null, false); 
        }
        if (!user.checkPassword(password)) { 
            return done(null, false); 
        } // Utiliza un método para verificar la contraseña del usuario
        return done(null, user);
      });
    }
  ));

//---------------------- JTW ----------------------------------------------


//Se crea un objeto user con las propiedades email y password
//const userData = { email: 'email', password: 'password' };

//Se crea el token 
//const token = jwt.createToken(userData);

//Se muestra el Token por consola
//console.log("Token Codificado: "+ token);

//Se almacena el Token decodificado
//const decodedToken = jwt.decodeToken(token);

// Muestra el contenido del token decodificado en la consola
//console.log("Token decodificado:  " );
//console.log(decodedToken);



// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

// BBDD

MongoClient.connect(process.env.DB_URL,{ 
    useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : app.locals.db = client.db(process.env.DB_NAME)
    console.log('Conexión exitosa a la base de datos');
});

// Definir una ruta para el login
app.post('/login', async (req, res) => {

    const db = req.app.locals.db;
    const { email, password } = req.body;
    // Verifica si el usuario existe en la base de datos
    const user = await db.collection('users').findOne({ email });
    console.log("El usuario si existe en la base de datos.");
    console.log("Se imprime user: ");
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
  
    // Verifica si la contraseña es correcta
    console.log("Verificando contraseña: ")
    //const passwordIsValid = await password.comparePassword(password);
    const passwordIsValid = await bcrypt.compareSync(user.password, password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
  
    // Si las credenciales son correctas, crear un token JWT con la información del usuario
    console.log("Creando Token: ")
    const token = createToken(user);
    console.log("Se imprime user por segunda vez: ")
    console.log(user)
  
    // Enviar el token JWT como respuesta al cliente
    res.json({ token });
  });

// Routes

const devices = require("./routes/devices");
app.use("/api/devices", devices);

const contact = require("./routes/contact");
app.use("/api", contact);

const register = require("./routes/register");
const { findOne } = require("../models/user");
app.use("/api", register);


// Server

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
