const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("./config");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
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