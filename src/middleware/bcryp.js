const bcrypt = require("bcrypt");

function bcryptFunction (req, res, next) {
    const usuario = req.body; //Usuario recibido del body
    usuario.password = bcrypt.hashSync(usuario.password, 10); //Se encripta la contraseña
    req.body = usuario; // Usuario con la contraseña cifrada
    next(); // Llama a la siguiente función, en este caso req y res
}

module.exports = bcryptFunction;