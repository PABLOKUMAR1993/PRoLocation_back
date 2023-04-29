const express = require('express');
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const jwt = require('jsonwebtoken');
const keys = require('./src/config/keys');

app.set('key', keys.key);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// BBDD

MongoClient.connect(process.env.DB_URL,{ useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : console.log("Conexión con la base de datos reralizada correctamente"),app.locals.db = client.db(process.env.DB_NAME);
});


app.get('/saludo', (req, res) => {
    res.send('Hola Mundo');
})

app.post('/loginNew', (req, res) => {
    const user = req.body;
    if (user.usuario == 'admin' && user.password == '1234') {
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
