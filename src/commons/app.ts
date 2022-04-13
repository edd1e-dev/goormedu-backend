import express from 'express';
import cookieParser from 'cookie-parser';
import env from '@/commons/config';
import passport from 'passport';
import { urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import GoogleStrategy from '../auth/google.strategy';
import JwtStrategy from '@/jwt/jwt.strategy';
import globalRouter from './globalRouter';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://c9925687ea754f8e864b42070bc71aa0@o1202267.ingest.sentry.io/6327291",
  tracesSampleRate: 1.0,
});

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

app.use(
  cors({
    origin: env.CLIENT_DOMAIN,
    credentials: true,
  }),
);

app.get('/jwt-fail', (_, res) =>
  res.send({ ok: false, error: 'Jwt Not Authenticated' }),
);

app.use('/', globalRouter); // 모든 요청을 globalRouter로

export default app;
