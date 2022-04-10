import env from '@/commons/config';
import { Strategy } from 'passport-jwt';

const JwtStrategy = new Strategy(
  {
    jwtFromRequest: (req) => req.cookies['jwt'] ?? null,
    secretOrKey: env.JWT_PRIVATEKEY,
  },
  (payload, verify) => verify(null, payload),
);

export default JwtStrategy;
