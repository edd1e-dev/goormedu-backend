import _GoogleStrategy from "passport-google-oauth2";

/*  
sub: 토큰 제목 (subject)

iat: 토큰이 발급된 시간 (issued at)
이 값을 사용하여 토큰의 age 가 얼마나 되었는지 판단 할 수 있습니다.
*/

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
