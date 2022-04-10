import express, { Response } from 'express';
import { Router } from 'express';
import { CustomError, IController, UserRole } from '@/commons/interfaces';
import TeacherRecordsService from './teacher-records.service';
import JwtGuard from '@/middleware/jwt.guard';
import RoleGuard from '@/middleware/role.guard';
import {
  CreateTeacherRecordData,
  UpdateTeacherRecordData,
} from './teacher-records.dto';
import { JwtPayload } from '@/jwt/jwt.dto';
import { validate, validateOrReject } from 'class-validator';

export default class TeacherRecorsController implements IController {
  public readonly route: string;
  private readonly router: Router;
  private readonly teacherRecordsService: TeacherRecordsService;

  constructor() {
    this.teacherRecordsService = new TeacherRecordsService();
    this.router = express.Router();
    this.route = '/teacher-records';
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
    this.router.get('/', JwtGuard, RoleGuard(UserRole.Admin), (_, res) =>
      this.getApi(
        () => this.teacherRecordsService.findAllTeacherRecords(),
        res,
      ),
    );

    this.router.get('/:user_id', (req, res) =>
      this.getApi(
        () =>
          this.teacherRecordsService.findTeacherRecordByUserId({
            user_id: parseInt(req.params.user_id),
          }),
        res,
      ),
    ); // 누구 개인의 교육자 정보를 볼 수 있음

    this.router.use(JwtGuard);
    this.router.post('/create', RoleGuard(UserRole.Student), (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const data = new CreateTeacherRecordData(req.body);
        const errors = await validate(data, { whitelist: true });
        if (errors.length > 0) {
          throw new CustomError('잘못된 값이 전달되었습니다.');
        }
        const result = await this.teacherRecordsService.createTeacherRecord({
          user_id: user.id,
          data,
        });
        return result;
      }, res),
    ); // 신청

    this.router.post('/update', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });
        const { accepted, ...body } = req.body;

        const data = new UpdateTeacherRecordData(body); // accept는 변경 허용 x
        const errors = await validate(data, { whitelist: true });
        if (errors.length > 0) {
          throw new CustomError('잘못된 값이 전달되었습니다.');
        }

        const result =
          await this.teacherRecordsService.updateTeacherRecordByUserId({
            user_id: user.id,
            data,
          });
        return result;
      }, res),
    );

    this.router.use(RoleGuard(UserRole.Admin));
    this.router.post('/:user_id/update', (req, res) =>
      this.getApi(async () => {
        const data = new UpdateTeacherRecordData(req.body);
        const errors = await validate(data, { whitelist: true });
        if (errors.length > 0) {
          throw new CustomError('잘못된 값이 전달되었습니다.');
        }

        const result =
          await this.teacherRecordsService.updateTeacherRecordByUserId({
            user_id: parseInt(req.params.user_id),
            data,
          });
        return result;
      }, res),
    );
    this.router.post('/:user_id/delete', (req, res) =>
      this.getApi(
        () =>
          this.teacherRecordsService.deleteTeacherRecordByUserId({
            user_id: parseInt(req.params.user_id),
          }),
        res,
      ),
    );

    return this.router;
  }
}
