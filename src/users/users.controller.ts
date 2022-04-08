import express, { Router } from 'express';
import passport from 'passport';
import verifyUserRole from '../middleware/VerifyUserRole';
import { UserRole } from './users.constant';
import UsersService from './users.service';
import jwt from 'jsonwebtoken';
import { Controller } from '@/interfaces/controller';

export default class UsersController implements Controller {
  private userService: Service;
  private router: Router;
  private route: string;

  constructor() {
    this.userService = new UsersService();
    this.router = express.Router();
    this.route = '/users';
  }

  getRoute() {
    return this.route;
  }

  getRouter() {
    /** 
    this.#router.use(
      passport.authenticate('jwt', { session: false, failWithError: true }),
      handleAuthSuccess,
      handleAuthFailure,
    );

    this.#router.get('/profile', async (req, res) => {
      try {
        const userId = parseInt(req.user?.id ?? '0');
        const userData = await this.#userService.findUserProfile(userId);
        if (userData) {
          if (userData.role !== req.user?.role) {
            const id = user.id,
              role = user.role;
            const jwtPayload = { id, role };
            const token = jwt.sign(jwtPayload, process.env.JWT_PRIVATEKEY);
            res.cookie('jwt', token, { httpOnly: true });
          }
          return res.send({ ok: true, result: userData });
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

    this.#router.get('/:user_id/delete', async (req, res) => {
      try {
        const ownProfile = req.user;
        const userId = parseInt(req.params?.user_id ?? '0');
        if (ownProfile.role !== UserRole.Admin && ownProfile.id !== userId) {
          return res.send({
            ok: false,
            error: '해당 명령을 실행할 권한이 없습니다.',
          });
        }

        let userData = await this.#userService.findUserById(userId);
        if (!userData) {
          return res.send({
            ok: false,
            error: '사용자 정보를 조회하지 못했습니다.',
          });
        }

        userData = await this.#userService.deleteUserById(userId);
        if (userData) {
          return res.send({ ok: true, result: { userId } });
        }
        return null;
      } catch (error) {
        console.log(error);
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    });

    this.#router.post('/:user_id/role/update', verifyUserRole(UserRole.Admin), async (req, res) => {
      try {
        const newRole = req.body?.role ?? UserRole.Teacher;
        const userId = req.params?.user_id ?? '0';

        if (newRole !== UserRole.Student && newRole !== UserRole.Teacher && newRole !== UserRole.Admin) {
          return res.send({ ok: false, error: '존재하지 않는 권한입니다.' });
        }

        const userData = await this.#userService.updateUserRole(userId, newRole);
        if (userData) {
          return res.send({ ok: true, result: userData });
        }
        return res.send({
          ok: false,
          error: '해당 사용자를 조회하지 못했습니다.',
        });
      } catch (error) {
        console.log(error);
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생했습니다.',
        });
      }
    });

    this.#router.get('/:user_id', async (req, res) => {
      try {
        const userId = parseInt(req.params?.user_id ?? '0');
        const userData = await this.#userService.findUserById(userId);
        if (userData) {
          return res.send({ ok: true, result: userData });
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
*/
    return this.router;
  }
}
