import express, { Response, Router } from 'express';
import CustomError from '@/commons/custom-error';
import { IController } from '@/interfaces/controller';
import { IUserDetail } from '@/interfaces/users';
import jwtMiddleware from '@/middleware/jwt.middleware';
import UsersService from './users.service';
import JwtService from '@/jwt/jwt.service';
import RoleGuard from '@/middleware/role-guard.middleware';

// class를 static으로 만들고 싶지만 지원하지 않는 것 같음
// 외부 모듈로 부터 생성해서 대입하는 속성들은 객체 프로퍼티로 만들었음
export default class UsersController implements IController {
  private usersService: UsersService;
  private jwtService: JwtService;
  private router: Router;
  private static readonly route = '/users';
  private static readonly userPublicSelect = {
    id: true,
    username: true,
    role: true,
  };
  private static readonly userDetailSelect = {
    id: true,
    username: true,
    role: true,
    email: true,
  };

  constructor() {
    this.usersService = new UsersService();
    this.jwtService = new JwtService();
    this.router = express.Router();
  }

  private async getApi(service: Function, res: Response) {
    try {
      const result: object | null = await service();
      return res.send(
        result
          ? { ok: true, result }
          : { ok: false, error: '요청 결과를 불러오지 못했습니다.' },
      );
    } catch (e) {
      let error = '예기치 못한 요류가 발생하였습니다.';
      if (e.name === CustomError.ErrorType) error = e.message;
      return res.send({ ok: false, error });
    }
  }
  getRoute() {
    return UsersController.route;
  }
  getRouter() {
    this.router.use(jwtMiddleware);

    this.router.get('/profile', (req, res) =>
      this.getApi(async () => {
        const user = req.user as Express.User;
        const result: IUserDetail = await this.usersService.findUserById({
          id: user.id,
          select: UsersController.userDetailSelect,
        });
        if (user.role !== result.role) {
          const token = this.jwtService.sign({
            id: user.id,
            role: result.role,
          });
          res.cookie('jwt', token, { httpOnly: true });
        }
        return result;
      }, res),
    );

    this.router.get('/:user_id', (req, res) =>
      this.getApi(
        () =>
          this.usersService.findUserById({
            id: parseInt(req.params.user_id),
            select: UsersController.userPublicSelect,
          }),
        res,
      ),
    );

    this.router.post('/:user_id/delete', (req, res) =>
      this.getApi(async () => {
        const user = req.user as Express.User;
        const id = parseInt(req.params.user_id);
        if (user.role !== UserRole.Admin && user.id !== id) {
          throw new CustomError('권한이 없습니다.'); // getApi에서 Error를 받음
        }
        await this.usersService.findUserById({
          id,
          select: { id: true },
        }); // 사용자가 존재하지 않으면 커스텀 에러를 반환
        return this.usersService.deleteUserById({ id });
      }, res),
    );

    this.router.post(
      '/:user_id/role/:role/update',
      RoleGuard(UserRole.Admin),
      (req, res) =>
        this.getApi(async () => {
          const { user_id, role } = req.params;

          if (!(role in UserRole)) {
            throw new CustomError('올바른 권한을 지정해주세요.');
          }
          const user = await this.usersService.updateUserById({
            id: parseInt(user_id),
            data: { role: UserRole[role] },
          });
          if (user) {
            const { sub, ...result } = user; // sub 데이터는 전송 x
            return result;
          }
          return null;
        }, res),
    );
    return this.router;
  }
}
