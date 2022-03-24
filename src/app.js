import express from "express";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import passport from "passport";
import globalRouter from "./router/globalRouter";
import GoogleStrategy from "./middleware/GoogleStrategy";
import JwtStrategy from "./middleware/JwtStrategy";

const app = express();

app.use(cookieParser()); // 쿠키를 받기 위해 필요
app.use(express.json()); // JSON형식으로 요청을 얻기 위해 필요
app.use(urlencoded({ extended: true })); //body데이터를 추출하기 쉽게 변화

passport.use(GoogleStrategy);
passport.use(JwtStrategy);

app.use("/", globalRouter); // 모든 요청을 globalRouter로

export default app;
