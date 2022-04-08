import express from 'express';
import AuthController from './auth/auth.controller';
import UsersController from './users/users.controller';
import TeacherRecordsController from './teacher-records/teacher-records.controller';
import ChaptersController from './chapters/chapters.controller';
import CategoriesController from './categories/categories.controller';

const globalRouter = express.Router();

const controllers = {
  usersController: new UsersController(),
  authController: new AuthController(),
  categoriesController: new CategoriesController(),
  teacherRecordsController: new TeacherRecordsController(),
  chaptersController: new ChaptersController(),
};

for (const [_, controller] of Object.entries(controllers)) {
  globalRouter.use(controller.getRoute(), controller.getRouter());
}

export default globalRouter;
