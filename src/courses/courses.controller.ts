import { CreateCourseData, UpdateCourseData } from './courses.dto';
import JwtGuard from '@/middleware/jwt.guard';
import { FindOptionsSelect } from 'typeorm';
import express, { Response, Router } from 'express';
import { CustomError, IController, UserRole } from '@/commons/interfaces';
import CoursesService from './services/courses.service';
import Course from './entities/course.entity';
import RoleGuard from '@/middleware/role.guard';
import TmpService from './services/temp.service';
import { JwtPayload } from '@/jwt/jwt.dto';
import { validate, validateOrReject } from 'class-validator';

export default class CoursesController implements IController {
  public readonly route: string;
  private readonly router: Router;
  private readonly coursesService: CoursesService;
  private readonly tmpService: TmpService;

  private static readonly courseSelect: FindOptionsSelect<Course> = {
    id: true,
    title: true,
    teacher_id: true,
    category_id: true,
    cover_image: true,
    description: true,
    level: true,
  };

  constructor() {
    this.coursesService = new CoursesService();
    this.tmpService = new TmpService();
    this.route = '/courses';
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
      let error = CustomError.UnExpectedErrorMessage;
      if (e.name === CustomError.ErrorType) error = e.message;
      return res.send({ ok: false, error });
    }
  }

  getRouter() {
    this.router.get('/', (_, res) =>
      this.getApi(
        () =>
          this.coursesService.findAllCourses({
            select: CoursesController.courseSelect,
          }),
        res,
      ),
    ); // 전체 코스 조회
    this.router.get('/search', (req, res) =>
      this.getApi(
        () =>
          this.coursesService.findCoursesByQuery({
            query: req.query.query?.toString() ?? '',
            select: CoursesController.courseSelect,
          }),
        res,
      ),
    );
    this.router.get('/category/:category_id', (req, res) =>
      this.getApi(() => {
        this.coursesService.findCoursesByCategoryId({
          category_id: parseInt(req.params.category_id),
          select: CoursesController.courseSelect,
        });
      }, res),
    );

    this.router.get('/learning-list', JwtGuard, (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const ids = await this.tmpService.findCourseIdsByStudentId({
          student_id: user.id,
        });

        const result = await this.coursesService.findCoursesByIds({
          ids,
          select: CoursesController.courseSelect,
        });
        return result;
      }, res),
    );
    this.router.get('/offering-list', JwtGuard, (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });
        const result = await this.coursesService.findCoursesByTeacherId({
          teacher_id: user.id,
          select: CoursesController.courseSelect,
        });
        return result;
      }, res),
    );
    this.router.post(
      '/create',
      JwtGuard,
      RoleGuard(UserRole.Teacher),
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });

          // s3로부터 cover_image url을 받아오는 과정
          const cover_image = ''; // s3 url

          const data = new CreateCourseData({
            ...req.body,
            cover_image,
          });
          const errors = await validate(data, { whitelist: true });
          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }
          const result = await this.coursesService.createCourse({
            teacher_id: user.id,
            data,
          });
          return result;
        }, res),
    );
    this.router.post(
      '/:course_id/update',
      JwtGuard,
      RoleGuard(UserRole.Teacher),
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });

          // s3로부터 cover_image url을 받아오는 과정
          // 이전 데이터를 지우는 과정은 update 서비스 내부에서?
          const cover_image = ''; // s3 url

          const data = new UpdateCourseData({
            ...req.body,
            cover_image,
          });
          const errors = await validate(data, { whitelist: true });
          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          const result = await this.coursesService.updateCourse({
            where: { id: parseInt(req.params.course_id), teacher_id: user.id },
            data,
          });
          return result;
        }, res),
    );

    // 코스를 지울 땐, 코스는 삭제되지 않고 챕터와 강의만 삭제된다.
    // deleteCourse는 teacher_id를 0으로 변경하여 해당 교육자로 부터 권한을 제거한다.
    this.router.post(
      '/:course_id/delete',
      JwtGuard,
      RoleGuard(UserRole.Teacher),
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });

          const course_id = parseInt(req.params.course_id);

          await this.tmpService.deleteChapters({
            where: { course_id, teacher_id: user.id },
          });

          await this.tmpService.deleteLectures({
            where: { course_id, teacher_id: user.id },
          });

          const result = await this.coursesService.deleteCourse({
            id: course_id,
            teacher_id: user.id,
          });

          return result;
        }, res),
    );
    this.router.get('/:course_id', (req, res) =>
      this.getApi(
        () =>
          this.coursesService.findCourseById({
            id: parseInt(req.params.course_id),
            select: CoursesController.courseSelect,
          }),
        res,
      ),
    );

    this.router.use(JwtGuard);
    this.router.get('/:course_id/learn-record', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const [learnRecord, count_complete_record] = await Promise.all([
          this.tmpService.findLearnRecord({
            where: {
              student_id: user.id,
              course_id: parseInt(req.params.course_id),
            },
            select: {},
          }),
          this.tmpService.countCompleteRecord({
            student_id: user.id,
            course_id: parseInt(req.params.course_id),
          }),
        ]);
        return { ...learnRecord, count_complete_record };
      }, res),
    ); // 수강 기록
    this.router.post('/:course_id/learn', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const result = await this.tmpService.createLearnRecord({
          student_id: user.id,
          course_id: parseInt(req.params.course_id),
        });

        return result;
      }, res),
    );
    return this.router;
  }
}
