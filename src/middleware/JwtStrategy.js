import { Strategy } from 'passport-jwt';

const option = {
  jwtFromRequest: (req) => req.cookies['jwt'] ?? null,
  secretOrKey: process.env.JWT_PRIVATEKEY,
};

const JwtStrategy = new Strategy(option, function (payload, done) {
  done(null, payload);
});

export function handleAuthSuccess(req, res, next) {
  next();
  // return res.send({ success: true, message: 'Logged in' })
}

export function handleAuthFailure(err, req, res, next) {
  return res.status(401).send({ ok: false, error: 'JWT Not Authenticated' });
  // return res.redirect('/auth/google');
}

export default JwtStrategy;
