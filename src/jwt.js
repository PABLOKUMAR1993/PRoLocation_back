const mongooseUser = require("../models/user");
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'); 

const secret = 'mysecretkey';

/*Función que crea un ogjeto payload con la información del usuario
sub: es el id del usuario
iat: es la fecha y hora que se emite el Token 
exp: es la fecha y hora en que el token expirará (una semana a partir de la emisión del token).

Finalmente, el código devuelve un token firmado usando jwt.sign(), 
que toma el objeto payload y la clave secreta secret como argumentos. 
La clave secreta secret es la misma que se definió en el primer código que proporcionaste.
*/
function createToken(user) {

    const payload = {
      sub: user.email,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    }
    return jwt.sign(payload, secret); 
  }

/*
Este código define las opciones para la estrategia de autenticación JWT (JSON Web Token).

La opción jwtFromRequest especifica cómo se debe extraer el token JWT de la solicitud de autenticación. 
En este caso, se utiliza ExtractJwt.fromAuthHeaderAsBearerToken() 
para extraer el token del encabezado "Authorization" en la solicitud, en la forma "Bearer <token>".

La opción secretOrKey especifica la clave secreta que se utilizará para firmar y verificar los tokens JWT. En este caso, la clave secreta se define anteriormente en el código y se almacena en la variable secret.
*/

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

  function configurePassport(passport) {
        //const db = req.app.locals.db;
        passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
            user.findById(payload.sub, (err, user) => {
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
    };

// Definición de la estrategia JWT
const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
    user.findById(payload.sub)
      .then(user => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(err => {
        return done(err, false);
      });
  });


//Función que decodifica el token, y devuelve un objeto que incluye el contenido del token en formato JSON. 

  function decodeToken(token) {
    return jwt.verify(token, mongooseUser);
  }
  
  //Se exportan las funciones y variables
  module.exports = {
    createToken,
    configurePassport,
    decodeToken,
    jwtStrategy,
    
  };
  

