import { validateOrReject } from 'class-validator';
import { CreateUserDTO } from '@/users/users.dto';
import express, { Router } from 'express';
import JwtService from '@/jwt/jwt.service';
import passport from 'passport';
import UsersService from '@/users/users.service';
import env from '@/commons/config';
import JwtGuard from '@/middleware/jwt.guard';
import { IController } from '@/commons/interfaces';
import { JwtPayload } from '@/jwt/jwt.dto';

export default class AuthController implements IController {
  public readonly route: string;
  private readonly jwtService: JwtService;
  private readonly usersService: UsersService;
  private readonly router: Router;

  constructor() {
    this.jwtService = new JwtService();
    this.usersService = new UsersService();
    this.router = express.Router();
    this.route = '/auth';
  }

  getRouter(): Router {
    /**
    this.router.use((req, res, next) => {
      this.redirectUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`).origin;
      if (!this.redirectUrl) {
        res.send({ ok: false, error: '리다이렉트 주소를 찾을 수 없습니다.' });
      } else {
        next();
      }
    });
     */

    this.router.get('/google/fail', (_, res) =>
      res.send({ ok: false, error: '구글 인증이 실패했습니다.' }),
    );

    this.router.get('/google/login', passport.authenticate('google'));

    this.router.get(
      '/google/oauth',
      passport.authenticate('google', {
        failureRedirect: '/auth/google/fail',
        session: false,
      }),
      async (req, res) => {
        try {
          const createUserDTO = new CreateUserDTO(
            req.user as unknown as CreateUserDTO,
          );
          await validateOrReject(createUserDTO, { whitelist: true });

          const user: JwtPayload | null = await this.usersService.findUserBySub(
            {
              sub: createUserDTO.sub,
              select: { id: true, role: true },
            },
          );
          let payload: JwtPayload;
          if (user) {
            // 기존 사용자가 존재하는 경우
            payload = user;
          } else {
            // 기존 사용자가 존재하지 않는 경우
            const newUser = await this.usersService.createUser(createUserDTO);
            payload = { id: newUser.id, role: newUser.role };
          }
          const token = await this.jwtService.sign(payload);
          return res
            .cookie('jwt', token, JwtService.jwtCookieOptions)
            .redirect(`https://${env.CLIENT_DOMAIN}`);
        } catch {
          // 로그인 실패를 나타내는 페이지로 이동
          return res.redirect(`https://${env.CLIENT_DOMAIN}`);
        }
      },
    );

    this.router.get('/logout', JwtGuard, (req, res) => {
      res.clearCookie('jwt', { domain: '.goormedu-clone.com', path: '/' });
      return res.redirect(`https://${env.CLIENT_DOMAIN}`);
    });

    return this.router;
  }
}
