import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";
import categoryRouter from "./category/categoryRouter";
import educatorRouter from "./educator/educatorRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);
globalRouter.use("/category", categoryRouter);
globalRouter.use("/educator", educatorRouter);

export default globalRouter;
