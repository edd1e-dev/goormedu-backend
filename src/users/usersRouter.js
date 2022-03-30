import express from "express";
import passport from "passport";
import { findUser, getUserSelfInfo, deleteUser, updateUserRole } from "./usersController";

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

usersRouter.post(
  "/:id/role/update", updateUserRole
);

usersRouter.get("/:id", findUser);

export default usersRouter;
