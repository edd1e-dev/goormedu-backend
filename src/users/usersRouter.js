import express from "express";
import passport from "passport";
import JwtStrategy from "passport-jwt/lib/strategy";
import { findUser, getUserProfile, deleteUser, updateUserRole } from "./usersController";

const usersRouter = express.Router();

usersRouter.get(
  "/profile", 
  passport.authenticate("jwt", { session: false }),
  getUserProfile
);

usersRouter.get(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }), 
  deleteUser
);

usersRouter.post(
  "/:id/role/update", 
  passport.authenticate("jwt", { session: false }), 
  updateUserRole
);

usersRouter.get("/:id", 
  passport.authenticate("jwt", { session: false }), 
  findUser
);

export default usersRouter;
