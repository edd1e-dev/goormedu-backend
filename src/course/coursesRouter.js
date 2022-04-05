import express from 'express';
import passport from 'passport';
import {
  cancelCourse,
  createCourse,
  deleteCourseById,
  findCourseById,
  findJoinCourses,
  findLearningData,
  findUploadCourses,
  joinCourse,
  updateCourseById,
} from './coursesController';

const coursesRouter = express.Router();

coursesRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createCourse
);

coursesRouter.get('/:id', findCourseById);
coursesRouter.get('/:id/learn-record', findLearningData);

coursesRouter.post(
  '/:id/update',
  passport.authenticate('jwt', { session: false }),
  updateCourseById
);

coursesRouter.post(
  '/:id/delete',
  passport.authenticate('jwt', { session: false }),
  deleteCourseById
);

coursesRouter.get(
  '/learning-list',
  passport.authenticate('jwt', { session: false }),
  findUploadCourses
);

coursesRouter.get(
  '/offering-list',
  passport.authenticate('jwt', { session: false }),
  findJoinCourses
);

coursesRouter.post(
  '/:id/learn',
  passport.authenticate('jwt', { session: false }),
  joinCourse
);

coursesRouter.post(
  '/:id/cancel',
  passport.authenticate('jwt', { session: false }),
  cancelCourse
);

export default coursesRouter;
