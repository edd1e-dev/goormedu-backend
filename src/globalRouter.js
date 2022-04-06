import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";
import categoryRouter from "./category/categoryRouter";
import educatorRouter from "./educator/educatorRouter";
import chapterRouter from "./chapter/chapterRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);
globalRouter.use("/category", categoryRouter);
globalRouter.use("/educator", educatorRouter);
globalRouter.use("/chapter", chapterRouter);

export default globalRouter;
