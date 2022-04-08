import jwt from 'jsonwebtoken';
import express from 'express';
import AuthService from './auth.service';
import passport from 'passport';
import {
  handleAuthFailure,
  handleAuthSuccess,
} from '../middleware/JwtStrategy';
import { UserRole } from '../users/users.constant';

export default class AuthController {
  #authService;
  #router;
  #route;

  constructor() {
    this.#authService = new AuthService();
    this.#router = express.Router();
    this.#route = '/auth';
  }

  getRoute() {
    return this.#route;
  }

  getRouter() {
    this.#router.get('/google', passport.authenticate('google'));

    this.#router.get('/fail', (_, res) =>
      res.send({
        ok: false,
        error: '인증이 완료된 사용자만 접근할 수 있습니다.',
      })
    );

    this.#router.get(
      '/google/oauth',
      passport.authenticate('google', {
        failureRedirect: '/auth/fail',
        session: false,
      }),
      async (req, res) => {
        if (req.user) {
          const userData = await this.#authService.findUserBySub(req.user);
          if (!userData) {
            const newUserData = await this.#authService.createNewUser(req.user);
            if (newUserData) {
              const token = jwt.sign(
                { id: newUserData?.id ?? '0', role: UserRole.Student },
                process.env.JWT_PRIVATEKEY
              );
              res.cookie('jwt', token, { httpOnly: true });
            }
          } else {
            if (!req.cookies['jwt']) {
              const token = jwt.sign(
                {
                  id: userData?.id ?? '0',
                  role: userData?.role ?? UserRole.Student,
                },
                process.env.JWT_PRIVATEKEY
              );
              res.cookie('jwt', token, { httpOnly: true });
            }
          }
          return res.redirect('/');
        } else {
          return res.send({
            ok: false,
            error: '예기치 못한 에러가 발생하였습니다.',
          });
        }
      }
    );

    this.#router.use(
      passport.authenticate('jwt', { session: false, failWithError: true }),
      handleAuthSuccess,
      handleAuthFailure
    );

    this.#router.get('/logout', (_, res) => {
      try {
        res.clearCookie('jwt').send;
        return res.send({ ok: true });
      } catch (error) {
        console.log(error);
        return res.send({ ok: false });
      }
    });

    this.#router.get('/status', async (req, res) => {
      try {
        const userId = parseInt(req.user?.id ?? '0');
        const userData = await this.#authService.confirmAuthStatus(userId);
        if (userData) {
          const id = userData.id,
            role = userData.role;

          if (role === req.user?.role) {
            return res.send({ ok: true, result: { roleUpdate: false } });
          } else {
            const jwtPayload = { id, role };
            const token = jwt.sign(jwtPayload, process.env.JWT_PRIVATEKEY);
            res.cookie('jwt', token, { httpOnly: true });
            return res.send({ ok: true, result: { roleUpdate: true } });
          }
        } else {
          return res.send({
            ok: false,
            error: '사용자 정보를 조회하지 못했습니다.',
          });
        }
      } catch (error) {
        console.log(error);
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    });

    return this.#router;
  }
}
