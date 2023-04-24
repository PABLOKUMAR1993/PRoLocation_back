// Importaciones

const express = require("express");
const router = express.Router();
const bcryptFunction = require("../middleware/bcryp")


//Registro
router.post("/register", bcryptFunction, (req, res) => {
    const db = req.app.locals.db;
    const usuario = req.body;
    db.collection("users")
        .find({ email: usuario.email })
        .toArray(function (err, usuarios) {
            if (usuarios.length === 0) {
                db.collection("users").insertOne(usuario, function (err, respuesta) {
                    if (err != null) {
                        console.log("Ha habido un error: ");
                        console.log(err);
                        res.send({ mensaje: "Ha habido un error: " + err });
                    } else {
                        console.log("Usuario registrado correctamente");
                        res.send({ mensaje: "Usuario registrado correctamente" });
                    }
                }
                );
            } else {
                console.log("Usuario ya registrado")
                res.send({ mensaje: "Usuario ya registrado" });
            }
        })
});

// Export

module.exports = router;