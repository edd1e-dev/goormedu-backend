import express from "express";
import passport from "passport";
import { login } from "../controller/authController";

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/google/oauth",
  passport.authenticate("google", {
    failureRedirect: "/auth/fail",
    session: false,
  }),
  login
);

authRouter.get("/fail", (_, res) => res.send({ error: "login fail" }));

export default authRouter;
