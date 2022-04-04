import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";
import categoryRouter from "./category/categoryRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);
globalRouter.use("/category", categoryRouter);

export default globalRouter;
