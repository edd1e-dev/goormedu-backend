import express from "express";
import passport from "passport";
import { login, logout, authStatusConfirm } from "./authController";

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/google/oauth",
  passport.authenticate("google", { failureRedirect: "/auth/fail", session: false, }),
  login
);
authRouter.get("/fail", (_, res) => res.send({ ok: false, error: '인증이 완료된 사용자만 접근할 수 있습니다.' }));
authRouter.get("/logout", logout);
authRouter.get("/status", authStatusConfirm);

export default authRouter;

