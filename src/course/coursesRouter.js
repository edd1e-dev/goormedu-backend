import express from 'express';
import passport from 'passport';
import {
  cancelCourse,
  createCourse,
  deleteCourseById,
  findCourseById,
  findJoinCourses,
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
  '/upload-list',
  passport.authenticate('jwt', { session: false }),
  findUploadCourses
);

coursesRouter.get(
  '/join-list',
  passport.authenticate('jwt', { session: false }),
  findJoinCourses
);

coursesRouter.post(
  '/:id/join',
  passport.authenticate('jwt', { session: false }),
  joinCourse
);

coursesRouter.post(
  '/:id/cancel',
  passport.authenticate('jwt', { session: false }),
  cancelCourse
);

coursesRouter.get('/:id', findCourseById);

export default coursesRouter;
