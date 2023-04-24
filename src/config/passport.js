const passport = require("passport");
const passportJWT = require("passport-jwt");
const config = require("./config");
const User = require("../../models/user");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);