import express from 'express';
import passport from 'passport';

import verifyUserRole from '../middleware/VerifyUserRole';

import { UserRole } from '../users/UserRole';

import {
  createLecture,
  deleteLectureById,
  findLectureById,
  findLectureDetail,
  updateLectureById,
} from './lecturesController';

import multer from 'multer';
const upload = multer({ dest: 'uploads' });

const lecturesRouter = express.Router();

lecturesRouter.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

// 일반적인 lecture 정보
lecturesRouter.get('/:id', findLectureById);

// Lecture 수강 할 때 필요한 detail 정보 까지
lecturesRouter.get('/:id/detail', findLectureDetail);

// Admin과 Teacher만 생성가능
lecturesRouter.post(
  '/create',
  verifyUserRole(UserRole.Teacher, UserRole.Admin),
  upload.single('image'),
  createLecture
);

// Admin과 Teacher만 수정가능
lecturesRouter.post(
  '/:id/update',
  verifyUserRole(UserRole.Teacher, UserRole.Admin)
);

// Admin과 Teacher만 삭제가능
lecturesRouter.post(
  '/:id/delete',
  verifyUserRole(UserRole.Teacher, UserRole.Admin),
  deleteLectureById
);

export default lecturesRouter;
