const express = require("express");
const router = express.Router();
const { generateToken, comparePassword } = require("../auth");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;