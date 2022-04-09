import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { urlencoded } from 'express';
import helmet from 'helmet';
import GoogleStrategy from './middleware/google.strategy';
import JwtStrategy from '@/jwt/jwt.strategy';
import globalRouter from './globalRouter';

const app = express();

app.use(cookieParser()); // 쿠키를 받기 위해 필요
app.use(express.json()); // JSON형식으로 요청을 얻기 위해 필요
app.use(urlencoded({ extended: true })); //body 데이터를 추출하기 쉽게 변화
app.use(
  helmet({
    contentSecurityPolicy: true,
    hidePoweredBy: true, // 헤더의 x-powered-by 제거
  }),
); // https://llshl.tistory.com/39

passport.use(GoogleStrategy);
passport.use(JwtStrategy);

app.get('/jwt-fail', (req, res) =>
  res.send({ ok: false, error: 'Jwt Not Authenticated' }),
);

app.use('/', globalRouter); // 모든 요청을 globalRouter로

export default app;
