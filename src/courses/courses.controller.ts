import Lecture from '@/courses/entities/lecture.entity';
import {
  CreateCourseData,
  UpdateCourseData,
  CreateCourseDataWithCoverImage,
  UpdateCourseDataWithCoverImage,
} from './dtos/courses.dto';
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
import LearnRecordsService from './services/learn-records.service';
import ChaptersService from './services/chapters.service';
import LearnRecord from './entities/learn-record.entity';
import Chapter from './entities/chapter.entity';
import {
  CreateChapterData,
  UpdateChapterData,
  UpdateChaptersOrderData,
} from './dtos/chapters.dto';
import LecturesService from './services/lectures.service';
import {
  CreateLectureData,
  CreateLectureDataWithVideoUrl,
  UpdateLectureData,
  UpdateLectureDataWithVideUrl,
  UpdateLecturesOrderData,
} from './dtos/lectures.dto';
import {
  SingleCoverImageMiddleware,
  SingleLectureVideoMiddleware,
} from '@/upload/upload.middleware';
import UploadService from '@/upload/upload.service';
import UsersService from '@/users/users.service';
import CompletionRecordsService from './services/completion-records.service';
import CompletionRecord from './entities/completion-record.entitiy';

export default class CoursesController implements IController {
  public readonly route: string;
  private readonly router: Router;
  private readonly coursesService: CoursesService;
  private readonly learnRecordsService: LearnRecordsService;
  private readonly chaptersService: ChaptersService;
  private readonly lecturesService: LecturesService;
  private readonly tmpService: TmpService;
  private readonly uploadService: UploadService;
  private readonly usersService: UsersService;
  private readonly completionRecordsService: CompletionRecordsService;

  private static readonly courseSelect: FindOptionsSelect<Course> = {
    id: true,
    title: true,
    teacher_id: true,
    category_id: true,
    cover_image: true,
    description: true,
    level: true,
  };
  private static readonly learnRecordSelect: FindOptionsSelect<LearnRecord> = {
    id: true,
    course_id: true,
    student_id: true,
    last_learning_date: true,
    last_lecture_id: true,
  };

  private static readonly chapterSelect: FindOptionsSelect<Chapter> = {
    id: true,
    title: true,
    course_id: true,
    teacher_id: true,
    order: true,
  };

  private static readonly lectureSelect: FindOptionsSelect<Lecture> = {
    id: true,
    title: true,
    course_id: true,
    teacher_id: true,
    chapter_id: true,
    order: true,
    is_public: true,
  };

  private static readonly completionRecordSelect: FindOptionsSelect<CompletionRecord> =
    {
      id: true,
      lecture_id: true,
      student_id: true,
      course_id: true,
    };

  constructor() {
    this.coursesService = new CoursesService();
    this.learnRecordsService = new LearnRecordsService();
    this.chaptersService = new ChaptersService();
    this.lecturesService = new LecturesService();
    this.tmpService = new TmpService();
    this.uploadService = new UploadService();
    this.usersService = new UsersService();
    this.completionRecordsService = new CompletionRecordsService();
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
      this.getApi(
        () =>
          this.coursesService.findCoursesByCategoryId({
            category_id: parseInt(req.params.category_id),
            select: CoursesController.courseSelect,
          }),
        res,
      ),
    );

    this.router.get('/learning-list', JwtGuard, (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const ids = await this.learnRecordsService.findCourseIdsByStudentId({
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
      SingleCoverImageMiddleware,
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });

          const category_id = parseInt(req.body.category_id);
          const level = parseInt(req.body.level);

          const data = new CreateCourseData({
            ...req.body,
            category_id,
            level,
          });

          const errors = await validate(data, { whitelist: true });

          // cover_image를 제외한 body값 검증
          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          if (!req.file) {
            throw new CustomError('코스 이미지 파일이 전달되지 않았습니다.');
          }

          // s3 관련 작업 시작
          const { email } = await this.usersService.findUserById({
            id: user.id,
            select: { email: true },
          });
          const splitedEmail = email.split('@');
          const upload = await this.uploadService.uploadFile({
            username: `${splitedEmail[0]}.${splitedEmail[1]}`,
            file: req.file,
          });
          const cover_image = upload['url'];

          const dataWithCoverImage = new CreateCourseDataWithCoverImage({
            ...data,
            cover_image,
          });

          const result = await this.coursesService.createCourse({
            teacher_id: user.id,
            data: dataWithCoverImage,
          });
          return result;
        }, res),
    );
    this.router.post(
      '/:course_id/update',
      JwtGuard,
      RoleGuard(UserRole.Teacher),
      SingleCoverImageMiddleware,
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });

          const course_id = parseInt(req.params.course_id);
          const { teacher_id, cover_image } =
            await this.coursesService.findCourseById({
              id: course_id,
              select: { teacher_id: true, cover_image: true },
            });

          if (teacher_id !== user.id) {
            throw new CustomError('코스 변경 권한이 없습니다.');
          }

          const category_id = parseInt(req.body.category_id);
          const level = parseInt(req.body.level);

          const data = new UpdateCourseData({
            ...req.body,
            category_id,
            level,
          });

          // file을 제외한 body값 검증
          const errors = await validate(data, { whitelist: true });
          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          // req.file이 있을 경우
          if (req.file) {
            const { email } = await this.usersService.findUserById({
              id: user.id,
              select: { email: true },
            });

            const splitedEmail = email.split('@');
            const upload = await this.uploadService.uploadFile({
              username: `${splitedEmail[0]}.${splitedEmail[1]}`,
              file: req.file,
            });
            const new_cover_image = upload['url'];

            const dataWithCoverImage = new UpdateCourseDataWithCoverImage({
              ...data,
              cover_image: new_cover_image,
            });

            const result = await this.coursesService.updateCourseWithCoverImage(
              {
                where: { id: course_id, teacher_id },
                data: dataWithCoverImage,
              },
            );

            // db 업데이트 성공하면 기존의 커버 이미지 삭제
            if (result) {
              await this.uploadService.deleteFile({
                key: cover_image.split('.amazonaws.com/')[1],
              });
            }
            return result;
          }

          const result = await this.coursesService.updateCourse({
            where: { id: course_id, teacher_id },
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

          await this.lecturesService.deleteLectures({
            course_id,
            teacher_id: user.id,
          });

          await this.chaptersService.deleteChapters({
            course_id,
            teacher_id: user.id,
          });

          // 코스 커버 이미지 삭제
          const { cover_image } = await this.coursesService.findCourseById({
            id: course_id,
            select: { cover_image: true },
          });
          await this.uploadService.deleteFile({
            key: cover_image.split('.amazonaws.com/')[1],
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

    this.router.get('/:course_id/chapters', (req, res) =>
      this.getApi(
        () =>
          this.chaptersService.findChaptersByCourseId({
            course_id: parseInt(req.params.course_id),
            select: CoursesController.chapterSelect,
          }),
        res,
      ),
    ); // 챕터 목록 조회, 강의 정보 포함 x, Chapter[]

    this.router.get('/:course_id/chapters/:chapter_id/lectures', (req, res) =>
      this.getApi(async () => {
        const result = await this.lecturesService.findLecturesByChapterId({
          chapter_id: parseInt(req.params.chapter_id),
          select: CoursesController.lectureSelect,
        });
        return result;
      }, res),
    ); // 챕터 내 강의 정보를 확인하기 위한 간단한 정보, public, Lecture[]

    this.router.use(JwtGuard);
    this.router.get(
      '/:course_id/lectures/:lecture_id/completion-record',
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });
          const lecture_id = parseInt(req.params.lecture_id);
          const course_id = parseInt(req.params.course_id);

          const result =
            await this.completionRecordsService.findCompletionRecord({
              where: { student_id: user.id, lecture_id, course_id },
              select: CoursesController.completionRecordSelect,
            });
          return result;
        }, res),
    ); // 해당 강의 이수 여부 확인
    this.router.post('/:course_id/lectures/:lecture_id/complete', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const course_id = parseInt(req.params.course_id);
        const lecture_id = parseInt(req.params.lecture_id);

        await this.learnRecordsService.findLearnRecord({
          where: { student_id: user.id, course_id },
        });
        // 수강 기록이 존재하지 않으면 에러 반환

        const result =
          await this.completionRecordsService.createCompletionRecord({
            student_id: user.id,
            lecture_id,
            course_id,
          });

        await this.learnRecordsService.updateLearnRecord({
          where: { student_id: user.id, course_id },
          data: {
            last_lecture_id: result.lecture_id,
            last_learning_date: result.created_at,
          },
        });

        return result;
      }, res),
    ); // 해당 강의 이수 완료 요청
    this.router.get('/:course_id/lectures/:lecture_id/detail', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });
        const course_id = parseInt(req.params.course_id);

        const { teacher_id } = await this.coursesService.findCourseById({
          id: course_id,
          select: { teacher_id: true },
        });
        if (teacher_id !== user.id) {
          await this.learnRecordsService.findLearnRecord({
            where: { student_id: user.id, course_id },
          });
        } // 내 강의가 아니고 수강 기록이 존재하지 않으면 에러 반환

        const result = await this.lecturesService.findLectureById({
          id: parseInt(req.params.lecture_id),
        });
        return result;
      }, res),
    ); // 강의 이수를 위한 강의 상세 정보 불러오기,

    this.router.get('/:course_id/learn-record', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const [learnRecord, count_completion_record] = await Promise.all([
          this.learnRecordsService.findLearnRecord({
            where: {
              student_id: user.id,
              course_id: parseInt(req.params.course_id),
            },
            select: CoursesController.learnRecordSelect,
          }),
          this.completionRecordsService.countCompletionRecord({
            student_id: user.id,
            course_id: parseInt(req.params.course_id),
          }),
        ]);
        return { ...learnRecord, count_completion_record };
      }, res),
    ); // 수강 기록
    this.router.post('/:course_id/learn', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const result = await this.learnRecordsService.createLearnRecord({
          student_id: user.id,
          course_id: parseInt(req.params.course_id),
        });

        return result;
      }, res),
    );

    this.router.use(RoleGuard(UserRole.Teacher));

    this.router.get('/:course_id/lectures/temp', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });
        const course_id = parseInt(req.params.course_id);

        const result = await this.lecturesService.findTempLecturesByCourseId({
          where: { course_id, teacher_id: user.id },
          select: CoursesController.lectureSelect,
        });
        return result;
      }, res),
    );

    this.router.post('/:course_id/chapters/create', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const data = new CreateChapterData(req.body);
        const errors = await validate(data, { whitelist: true });
        if (errors.length > 0) {
          throw new CustomError('잘못된 값이 입력되었습니다.');
        }
        const course_id = parseInt(req.params.course_id);

        const { teacher_id } = await this.coursesService.findCourseById({
          id: course_id,
          select: { teacher_id: true },
        });

        if (teacher_id !== user.id) {
          throw new CustomError('챕터 생성 권한이 없습니다.');
        }

        const chapters = await this.chaptersService.findChaptersByCourseId({
          course_id,
          select: { order: true },
        });

        const orders: number[] = [];

        chapters.map((chapter) => {
          orders.push(chapter.order);
        });

        const order = orders.length > 0 ? Math.max(...orders) + 1 : 1;

        const result = await this.chaptersService.createChapter({
          where: {
            teacher_id: user.id,
            course_id,
            order,
          },
          data,
        });
        return result;
      }, res),
    );
    this.router.post('/:course_id/chapters/update', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const course_id = parseInt(req.params.course_id);

        const { teacher_id } = await this.coursesService.findCourseById({
          id: course_id,
          select: { teacher_id: true },
        });

        if (teacher_id !== user.id) {
          throw new CustomError('챕터 순서 수정 권한이 없습니다.');
        }

        const data = new UpdateChaptersOrderData(req.body);
        const errors = await validate(data, { whitelist: true });

        if (errors.length > 0) {
          throw new CustomError('잘못된 값이 입력되었습니다.');
        }

        const chapter_records =
          await this.chaptersService.findChaptersByCourseId({
            course_id,
            select: { id: true, order: true },
          });

        const chapter_records_ids = chapter_records.map((chapter) => {
          return chapter.id;
        });

        if (!(data.chapters.length === chapter_records_ids.length)) {
          throw new CustomError('잘못된 값이 입력되었습니다.');
        }
        if (
          ![...data.chapters].sort().every(function (value, index) {
            return value === [...chapter_records_ids].sort()[index];
          })
        ) {
          throw new CustomError('잘못된 값이 입력되었습니다.');
        }

        const result = await this.chaptersService.updateChapterOrders({
          teacher_id: user.id,
          data,
        });

        return result;
      }, res),
    );
    this.router.post('/:course_id/chapters/:chapter_id/update', (req, res) =>
      this.getApi(async () => {
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const course_id = parseInt(req.params.course_id);

        const { teacher_id } = await this.coursesService.findCourseById({
          id: course_id,
          select: { teacher_id: true },
        });

        if (teacher_id !== user.id) {
          throw new CustomError('챕터 수정 권한이 없습니다.');
        }

        const data = new UpdateChapterData(req.body);
        const errors = await validate(data, { whitelist: true });
        if (errors.length > 0) {
          throw new CustomError('잘못된 값이 입력되었습니다.');
        }

        const result = await this.chaptersService.updateChapter({
          where: {
            id: parseInt(req.params.chapter_id),
            teacher_id: user.id,
          },
          data,
        });
        return result;
      }, res),
    );
    this.router.post('/:course_id/chapters/:chapter_id/delete', (req, res) =>
      this.getApi(async () => {
        const id = parseInt(req.params.chapter_id);
        const user = new JwtPayload(req.user as Express.User);
        await validateOrReject(user, { whitelist: true });

        const lectures = await this.lecturesService.findLecturesByChapterId({
          chapter_id: id,
          select: { id: true },
        });

        if (lectures.length > 0) {
          throw new CustomError('강의가 존재하는 챕터는 삭제 할 수 없습니다.');
        }

        const deleteResult = await this.chaptersService.deleteChapter({
          id,
          teacher_id: user.id,
        });

        return deleteResult;
      }, res),
    );
    this.router.post(
      '/:course_id/lectures/create',
      SingleLectureVideoMiddleware,
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });
          const course_id = parseInt(req.params.course_id);

          const { teacher_id } = await this.coursesService.findCourseById({
            id: course_id,
            select: { teacher_id: true },
          });

          if (teacher_id !== user.id) {
            throw new CustomError('강의 생성 권한이 없습니다.');
          }

          const chapter_id = parseInt(req.body.chapter_id);

          const is_public =
            req.body.is_public &&
            (req.body.is_public === 'true' || req.body.is_public === 'false')
              ? JSON.parse(req.body.is_public)
              : null;

          await this.chaptersService.findChapterByChapterAndCourseId({
            chapter_id,
            course_id,
            select: { id: true },
          });

          const data = new CreateLectureData({
            ...req.body,
            chapter_id,
            is_public,
          });

          const errors = await validate(data, { whitelist: true });

          // video_url을 제외한 body값 검증
          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          // order값 계산
          const lectures = await this.lecturesService.findLecturesByChapterId({
            chapter_id,
            select: { order: true },
          });

          const orders: number[] = [];

          lectures.map((lecture) => {
            orders.push(lecture.order);
          });

          const order = orders.length > 0 ? Math.max(...orders) + 1 : 1;

          // req.file이 있을 경우
          if (req.file) {
            const { email } = await this.usersService.findUserById({
              id: user.id,
              select: { email: true },
            });

            const splitedEmail = email.split('@');
            const upload = await this.uploadService.uploadFile({
              username: `${splitedEmail[0]}.${splitedEmail[1]}`,
              file: req.file,
            });
            const video_url = upload['url'];

            const dataWithVideoUrl = new CreateLectureDataWithVideoUrl({
              ...data,
              video_url,
            });

            const result = await this.lecturesService.createLectureWithVideoUrl(
              {
                where: { teacher_id: user.id, course_id, order },
                data: dataWithVideoUrl,
              },
            );

            return result;
          }

          const result = await this.lecturesService.createLecture({
            where: { teacher_id: user.id, course_id, order },
            data,
          });
          return result;
        }, res),
    );
    this.router.post(
      '/:course_id/chapters/:chapter_id/lectures/update',
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });

          const course_id = parseInt(req.params.course_id);
          const chapter_id = parseInt(req.params.chapter_id);

          const { teacher_id } = await this.coursesService.findCourseById({
            id: course_id,
            select: { teacher_id: true },
          });

          if (teacher_id !== user.id) {
            throw new CustomError('강의 순서 수정 권한이 없습니다.');
          }

          const data = new UpdateLecturesOrderData(req.body);
          const errors = await validate(data, { whitelist: true });

          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          const lecture_records =
            await this.lecturesService.findLecturesByChapterId({
              chapter_id,
              select: { id: true, order: true },
            });

          const lecture_records_ids = lecture_records.map((lecture) => {
            return lecture.id;
          });

          if (!(data.lectures.length === lecture_records_ids.length)) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          if (
            ![...data.lectures].sort().every(function (value, index) {
              return value === [...lecture_records_ids].sort()[index];
            })
          ) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          const result = await this.lecturesService.updateLectureOrders({
            teacher_id: user.id,
            data,
          });

          return result;
        }, res),
    );
    this.router.post(
      '/:course_id/lectures/:lecture_id/update',
      SingleLectureVideoMiddleware,
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });
          const course_id = parseInt(req.params.course_id);
          const lecture_id = parseInt(req.params.lecture_id);

          const { teacher_id } = await this.coursesService.findCourseById({
            id: course_id,
            select: { teacher_id: true },
          });

          if (teacher_id !== user.id) {
            throw new CustomError('강의 수정 권한이 없습니다.');
          }

          const chapter_id = parseInt(req.body.chapter_id);
          const is_public =
            req.body.is_public &&
            (req.body.is_public === 'true' || req.body.is_public === 'false')
              ? JSON.parse(req.body.is_public)
              : null;

          // 변경할 챕터 id가 있으면 order값 계산해서 data검증에 넣어줌

          if (req.body.order) {
            throw new CustomError('순서는 이 방식으로 변경 할 수 없습니다.');
          }

          let order: number | null = null;

          if (chapter_id) {
            await this.chaptersService.findChapterByChapterAndCourseId({
              course_id,
              chapter_id,
              select: { id: true },
            });
            const lectures = await this.lecturesService.findLecturesByChapterId(
              {
                chapter_id,
                select: { order: true },
              },
            );

            const orders: number[] = [];

            lectures.map((lecture) => {
              orders.push(lecture.order);
            });

            order = orders.length > 0 ? Math.max(...orders) + 1 : 1;
          }

          const data = new UpdateLectureData({
            ...req.body,
            chapter_id,
            is_public,
            order,
          });

          // file을 제외한 body값 검증
          const errors = await validate(data, { whitelist: true });
          if (errors.length > 0) {
            throw new CustomError('잘못된 값이 입력되었습니다.');
          }

          // req.file이 있을 경우
          if (req.file) {
            // 아래 video_url은 없을 수도 있음 -> 만들 때 video파일은 option이라서
            const { video_url } = await this.lecturesService.findLectureById({
              id: lecture_id,
            });

            const { email } = await this.usersService.findUserById({
              id: user.id,
              select: { email: true },
            });

            const splitedEmail = email.split('@');
            const upload = await this.uploadService.uploadFile({
              username: `${splitedEmail[0]}.${splitedEmail[1]}`,
              file: req.file,
            });
            const new_video_url = upload['url'];

            const dataWithVideoUrl = new UpdateLectureDataWithVideUrl({
              ...data,
              video_url: new_video_url,
            });

            const result = await this.lecturesService.updateLecutreWithVideoUrl(
              {
                where: { teacher_id: user.id, course_id, id: lecture_id },
                data: dataWithVideoUrl,
              },
            );

            // db 업데이트 성공하고 기존의 비디오가 존재하면 기존의 비디오 삭제
            if (result && video_url) {
              await this.uploadService.deleteFile({
                key: video_url.split('.amazonaws.com/')[1],
              });
            }

            return result;
          }

          const result = await this.lecturesService.updateLecutre({
            where: { teacher_id: user.id, course_id, id: lecture_id },
            data,
          });

          return result;
        }, res),
    );
    this.router.post(
      '/:course_id/lectures/:lecture_id/delete',
      SingleLectureVideoMiddleware,
      (req, res) =>
        this.getApi(async () => {
          const user = new JwtPayload(req.user as Express.User);
          await validateOrReject(user, { whitelist: true });
          const course_id = parseInt(req.params.course_id);
          const lecture_id = parseInt(req.params.lecture_id);

          // 강의 비디오 삭제
          const { video_url } = await this.lecturesService.findLectureById({
            id: lecture_id,
            select: { video_url: true },
          });
          await this.uploadService.deleteFile({
            key: video_url!.split('.amazonaws.com/')[1],
          });

          const result = await this.lecturesService.deleteLecture({
            id: lecture_id,
            teacher_id: user.id,
            course_id,
          });

          await this.completionRecordsService.deleteCompletionRecord({
            lecture_id,
          });

          return result;
        }, res),
    );

    return this.router;
  }
}
