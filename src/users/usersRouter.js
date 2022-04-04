import express from 'express';
import passport from 'passport';
import verifyUserRole from '../middleware/VerifyUserRole';
import verifyAuthById from '../middleware/VerifyAuth';
import {
  findUserById,
  deleteUserById,
  getSelfUserProfile,
  updateUserRole
} from './usersController';
import { UserRole } from './UserRole';

const usersRouter = express.Router();

usersRouter.get('/verify', (_, res) =>
  res.send({ ok: false, error: '사용자 검증에 실패하였습니다.' }),
);

usersRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: "/users/verify" }), verifyAuthById);

/* 
  권한 검증 미들웨어 사용
  Admin하고 Student만 다음 매개변수의 비동기 함수 실행 가능
  usersRouter.get("/profile", verifyUserRole(UserRole.Admin), getSelfUserProfile);
*/

usersRouter.get('/profile', getSelfUserProfile);
usersRouter.get('/:id/delete', deleteUserById);

usersRouter.post(
  '/:id/role/update',
  verifyUserRole(UserRole.Admin),
  updateUserRole,
);
usersRouter.get('/:id', findUserById);

export default usersRouter;
