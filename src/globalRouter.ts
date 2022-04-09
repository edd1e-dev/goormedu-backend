import express from 'express';
import { IController } from './interfaces/controller';

const globalRouter = express.Router();

const controllers: IController[] = [];

for (const controller of controllers) {
  globalRouter.use(controller.getRoute(), controller.getRouter());
}

export default globalRouter;
