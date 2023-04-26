// Import

const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
//const mongoose = require('mongoose');
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
//const mongooseUser = require("../models/user");
//const auth = require("./config/auth")


//////// JWT
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'your_secret_key_here';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({_id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

const jwt = require('jsonwebtoken');
app.post('/login', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({message:'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          const token = jwt.sign({_id: user._id}, 'your_secret_key_here');
          res.status(200).json({token: 'Bearer ' + token});
        } else {
          res.status(401).json({message:'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

app.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.json({user: req.user});
});

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// BBDD

MongoClient.connect(process.env.DB_URL,{ 
    useUnifiedTopology: true }, (err, client) => {
    err != null ? console.log(`Error al conectar a la bbdd: ${err}`) : app.locals.db = client.db(process.env.DB_NAME)
    console.log('Conexión exitosa a la base de datos');
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
