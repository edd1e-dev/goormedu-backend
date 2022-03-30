import express from "express";
import passport from "passport";
import { findUser, getUserSelfInfo, deleteUser, joinUser, changeUserRole } from "./usersController";

const usersRouter = express.Router();

usersRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.send({ user: req.user });
  }
);

usersRouter.get(
  "/self", (req, res) => {
      return res.send("self");
    }
);

usersRouter.get(
  "/:id/delete", deleteUser
);

usersRouter.get(
  "/:id/role/update", changeUserRole
);

usersRouter.get("/:id", findUser);

export default usersRouter;
