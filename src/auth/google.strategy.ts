import { CreateUserDTO } from '@/users/users.dto';
import env from '@/commons/config';
import { Strategy } from 'passport-google-oauth2';
/*  
sub: 토큰 제목 (subject)

iat: 토큰이 발급된 시간 (issued at)
이 값을 사용하여 토큰의 age 가 얼마나 되었는지 판단 할 수 있습니다.
*/

const GoogleStrategy = new Strategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_SECRET,
    callbackURL: `http://${env.DOMAIN}/auth/google/oauth`, // ${env.PORT}
    scope: ['profile', 'email'],
  },
  (_, __, profile, done) => {
    const { sub, email, displayName } = profile;
    return done(null, {
      sub: sub + '',
      email,
      username: displayName,
    });
  },
);

export default GoogleStrategy;
