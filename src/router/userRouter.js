import express from "express";
import passport from "passport";
import { findUser } from "../controller/userController";

const userRouter = express.Router();

userRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.send({ user: req.user });
  }
);

userRouter.get("/:id", findUser);

export default userRouter;
