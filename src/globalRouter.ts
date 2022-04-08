import express from 'express';
import { Controller } from './interfaces/controller';

const globalRouter = express.Router();

const controllers: Controller[] = [];

for (const controller of controllers) {
  globalRouter.use(controller.getRoute(), controller.getRouter());
}

export default globalRouter;
