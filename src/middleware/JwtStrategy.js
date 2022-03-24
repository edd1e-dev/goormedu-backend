import { Strategy } from "passport-jwt";

const option = {
  jwtFromRequest: (req) => req.cookies["jwt"] ?? null,
  secretOrKey: process.env.JWT_PRIVATEKEY,
};

const JwtStrategy = new Strategy(option, function (payload, done) {
  done(null, payload);
});

export default JwtStrategy;
