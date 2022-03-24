import _GoogleStrategy from "passport-google-oauth2";

const GoogleStrategy = new _GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:4000/auth/google/oauth",
    scope: ["profile", "email"],
  },
  (_, __, profile, done) => {
    const { sub: _sub, email } = profile;
    const sub = _sub + "";
    return done(null, { sub, email });
  }
);

export default GoogleStrategy;
