import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";
import educatorRouter from "./educator/educatorRouter";
import ChaptersController from "./chapters/chapters.controller";
import CategoriesController from "./categories/categories.controller";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);
globalRouter.use("/categories", new CategoriesController().getRouter());
globalRouter.use("/educator", educatorRouter);
globalRouter.use("/chapters", new ChaptersController().getRouter());

export default globalRouter;
