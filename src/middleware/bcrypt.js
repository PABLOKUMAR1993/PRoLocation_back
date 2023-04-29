const bcrypt = require("bcrypt");

function bcryptFunction (req, res, next) {
    const user = req.body; //Usuario recibido del body
    user.password = bcrypt.hashSync(user.password, 10); //Se encripta la contraseña
    req.body = user; // Usuario con la contraseña cifrada
    next(); // Llama a la siguiente función, en este caso req y res
};

module.exports = bcryptFunction;