import * as passport from 'passport';

const googleMiddleware = passport.authenticate('google', {
  failureRedirect: '/auth/fail',
  session: false,
});

export default googleMiddleware;
