import express from "express";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import passport from "passport";
import globalRouter from "./globalRouter";
import GoogleStrategy from "./middleware/GoogleStrategy";
import JwtStrategy from "./middleware/JwtStrategy";

const app = express();

app.use(cookieParser()); // 쿠키를 받기 위해 필요
app.use(express.json()); // JSON형식으로 요청을 얻기 위해 필요
app.use(urlencoded({ extended: true })); //body데이터를 추출하기 쉽게 변화
app.disable('x-powered-by'); // 헤더의 x-powered-by: Express 숨기기

passport.use(GoogleStrategy);
passport.use(JwtStrategy);

app.use("/", globalRouter); // 모든 요청을 globalRouter로

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home :)'
    })
})

export default app;
