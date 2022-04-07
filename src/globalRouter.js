import express from 'express';
import AuthController from './auth/auth.controller';
import UsersController from './users/users.controller';
import TeacherRecordsController from './teacher-records/teacher-records.controller';
import ChaptersController from './chapters/chapters.controller';
import CategoriesController from './categories/categories.controller';

const globalRouter = express.Router();

globalRouter.use('/users', new UsersController().getRouter());
globalRouter.use('/auth', new AuthController().getRouter());
globalRouter.use('/categories', new CategoriesController().getRouter());
globalRouter.use(
  '/teacher-records',
  new TeacherRecordsController().getRouter()
);
globalRouter.use('/chapters', new ChaptersController().getRouter());

export default globalRouter;
