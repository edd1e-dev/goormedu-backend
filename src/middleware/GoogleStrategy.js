import _GoogleStrategy from "passport-google-oauth2";

const GoogleStrategy = new _GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:4000/auth/google/oauth",
    scope: ["email", "profile"],
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    return done(null, profile);
  }
);

export default GoogleStrategy;
