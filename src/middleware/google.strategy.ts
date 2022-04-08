import env from '@/config';
import { Strategy } from 'passport-google-oauth2';
//import 'dotenv/config';
/*  
sub: 토큰 제목 (subject)

iat: 토큰이 발급된 시간 (issued at)
이 값을 사용하여 토큰의 age 가 얼마나 되었는지 판단 할 수 있습니다.
*/

const GoogleStrategy = new Strategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_SECRET,
    callbackURL: `http://${env.DOMAIN}:${env.PORT}/auth/google/oauth`,
    scope: ['profile', 'email'],
  },
  (_, __, profile, done) => {
    const { sub: _sub, email, picture, displayName } = profile;
    const sub = _sub + '';
    return done(null, { sub, email, picture, displayName });
  },
);

export default GoogleStrategy;
