import passport from 'passport';

const JwtGuard = passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/jwt-fail',
});

export default JwtGuard;
