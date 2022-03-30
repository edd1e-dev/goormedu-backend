import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);

export default globalRouter;
