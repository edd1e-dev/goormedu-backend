import express from 'express';
import AuthController from '@/auth/auth.controller';
import UsersController from '@/users/users.controller';
import { IController } from './interfaces';
import TeacherRecorsController from '@/teacher-records/teacher-records.controller';
import CategoriesController from '@/categories/categories.controller';

const globalRouter = express.Router();

const controllers: IController[] = [
  new UsersController(),
  new AuthController(),
  new TeacherRecorsController(),
  new CategoriesController(),
];

for (const controller of controllers) {
  globalRouter.use(controller.route, controller.getRouter());
}

export default globalRouter;
