import { UpdateRoleData } from './users.dto';
import express, { Response, Router } from 'express';
import UsersService from './users.service';
import JwtService from '@/jwt/jwt.service';
import RoleGuard from '@/middleware/role.guard';
import { FindOptionsSelect } from 'typeorm';
import User from './user.entity';
import JwtGuard from '@/middleware/jwt.guard';
import {
  IController,
  IUserDetail,
  UserRole,
  CustomError,
} from '@/commons/interfaces';
import { validate, validateOrReject } from 'class-validator';
import { JwtPayload } from '@/jwt/jwt.dto';
import LearnRecordsService from '@/courses/services/learn-records.service';
import TeacherRecordsService from '@/teacher-records/teacher-records.service';
import CompletionRecordsService from '@/courses/services/completion-records.service';

// class를 static으로 만들고 싶지만 지원하지 않는 것 같음
// 외부 모듈로 부터 생성해서 대입하는 속성들은 객체 프로퍼티로 만들었음
export default class UsersController implements IController {
  // readonly 속성은 생성된 후에는 변경 불가
  public readonly route: string;
  private readonly usersService: UsersService;
  private readonly learnRecordsService: LearnRecordsService;
  private readonly teacherRecordsService: TeacherRecordsService;
  private readonly completionRecordsService: CompletionRecordsService;
  private readonly jwtService: JwtService;
  private readonly router: Router;
  private static readonly userPublicSelect: FindOptionsSelect<User> = {
    id: true,
    username: true,
    role: true,
  };
  private static readonly userDetailSelect: FindOptionsSelect<User> = {
    id: true,
    username: true,
    role: true,
    email: true,
    created_at: true,
    updated_at: true,
  };

  constructor() {
    this.usersService = new UsersService();
    this.learnRecordsService = new LearnRecordsService();
    this.completionRecordsService = new CompletionRecordsService();
    this.teacherRecordsService = new TeacherRecordsService();
    this.jwtService = new JwtService();
    this.router = express.Router();
    this.route = '/users';
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
      let error = CustomError.UnExpectedErrorMessage;
      if (e.name === CustomError.ErrorType) error = e.message;
      return res.send({ ok: false, error });
    }
  }

  getRouter() {
    this.router.get('/profile', JwtGuard, (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const result: IUserDetail = await this.usersService.findUserById({
          id: user.id,
          select: UsersController.userDetailSelect,
        });
        if (user.role !== result.role) {
          const token = await this.jwtService.sign({
            id: user.id,
            role: result.role,
          });
          res.cookie('jwt', token, JwtService.jwtCookieOptions);
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

    this.router.post('/:user_id/delete', JwtGuard, (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const id = parseInt(req.params.user_id);
        if (user.role !== UserRole.Admin && user.id !== id) {
          throw new CustomError('권한이 없습니다.'); // getApi에서 Error를 받음
        }
        await this.usersService.findUserById({
          id,
          select: { id: true },
        }); // 사용자가 존재하지 않으면 커스텀 에러를 반환

        // 사용자와 관련된 수강기록, 이수기록, 교육자 신청 기록 삭제.
        // 코스는 삭제 x
        this.learnRecordsService.deleteLearnRecordByStudentId({
          student_id: id,
        });
        this.completionRecordsService.deleteCompletionRecordByStudentId({
          student_id: id,
        });
        this.teacherRecordsService.deleteTeacherRecordByUserId({ user_id: id });

        return this.usersService.deleteUserById({ id });
      }, res),
    );

    this.router.post(
      '/:user_id/role/:role/update',
      JwtGuard,
      RoleGuard(UserRole.Admin),
      (req, res) =>
        this.getApi(async () => {
          const user_id = req.params.user_id;
          const role = req.params.role as UserRole;

          const data = new UpdateRoleData({ role });
          const errors = await validate(data, { whitelist: true });
          if (errors.length > 0) {
            throw new CustomError('올바른 권한을 입력해주세요.');
          }
          const user = await this.usersService.updateUserById({
            id: parseInt(user_id),
            data,
          });
          return { id: user.id, role: user.role };
        }, res),
    );
    return this.router;
  }
}
