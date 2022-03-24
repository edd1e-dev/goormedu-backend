import express from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

const globalRouter = express.Router();

globalRouter.use("/user", userRouter);
globalRouter.use("/auth", authRouter);

export default globalRouter;
