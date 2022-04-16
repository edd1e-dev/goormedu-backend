import UploadController from '@/upload/upload.controller';
import express from 'express';
import AuthController from '@/auth/auth.controller';
import UsersController from '@/users/users.controller';
import { IController } from './interfaces';
import TeacherRecordsController from '@/teacher-records/teacher-records.controller';
import CategoriesController from '@/categories/categories.controller';
import CoursesController from '@/courses/courses.controller';

const globalRouter = express.Router();

globalRouter.get('/', (_, res) =>
  res.send({ ok: true, result: 'HealthCheck Success' }),
);

const controllers: IController[] = [
  new UploadController(),
  new UsersController(),
  new AuthController(),
  new TeacherRecordsController(),
  new CategoriesController(),
  new CoursesController(),
];

for (const controller of controllers) {
  globalRouter.use(controller.route, controller.getRouter());
}

export default globalRouter;
