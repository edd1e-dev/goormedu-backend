import express from "express";
import authRouter from "./authRouter";
import userRouter from "./usersRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);

export default globalRouter;
