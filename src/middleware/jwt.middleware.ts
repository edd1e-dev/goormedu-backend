import * as passport from 'passport';

const jwtMiddleware = passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/jwt-fail',
});

export default jwtMiddleware;
