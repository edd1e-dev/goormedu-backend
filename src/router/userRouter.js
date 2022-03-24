import express from "express";
import { findUser } from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/:id", findUser);
userRouter.get("/", (_, res) => res.redirect("/"));

export default userRouter;
