import express from "express";
import passport from "passport";

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/google/oauth",
  passport.authenticate("google", {
    failureRedirect: "/auth/fail",
    successRedirect: "/",
    session: false,
  })
);

authRouter.get("/fail", (_, res) => res.send({ error: "login fail" }));

export default authRouter;
