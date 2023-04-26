const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("./config");

const generateToken = (user) => {
   return jwt.sign(
    {
      email: user.email,
      password: user.password,
    },
    config.secret,
    { expiresIn: config.expiresIn }
  );
};

const comparePassword = (password, userPassword) => {
  return bcrypt.compare(password, userPassword);
};

module.exports = {
  generateToken,
  comparePassword,
};