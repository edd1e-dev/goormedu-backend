import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";
import categoriesRouter from "./categories/categories.service";
import educatorRouter from "./educator/educatorRouter";
import chaptersRouter from "./chapters/chaptersRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);
globalRouter.use("/categories", categoriesRouter);
globalRouter.use("/educator", educatorRouter);
globalRouter.use("/chapters", chaptersRouter);

export default globalRouter;
