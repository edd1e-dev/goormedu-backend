import express from "express";
import authRouter from "./auth/authRouter";
import userRouter from "./users/usersRouter";
import courseRouter from "./course/coursesRouter";

const globalRouter = express.Router();

globalRouter.use("/users", userRouter);
globalRouter.use("/auth", authRouter);
globalRouter.use("/courses", courseRouter);

export default globalRouter;
