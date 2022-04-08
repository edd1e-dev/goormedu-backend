import express from 'express';
import LearnRecordsService from './services/learn-records.service';
import CoursesService from './services/courses.service';

export default class CoursesController {
  #coursesService;
  #learnRecordsService;
  #router;
  #route;
  #course;
  #learnRecord;
  constructor() {
    this.#coursesService = new CoursesService();
    this.#learnRecordsService = new LearnRecordsService();
    this.#router = express.Router();
    this.#route = 'courses';
    this.#course = {
      id: true,
      title: true,
      teacher_id: true,
      category_id: true,
      cover_image: true,
      description: true,
      level: true,
    };
    this.#learnRecord = {
      id: true,
      student_id: true,
      coruse_id: true,
      last_learning_date: true,
      last_lecture_id: true,
      next_lecture_id: true,
    };
  }

  async #getApi(service, res) {
    try {
      const result = await service();
      return res.send(
        result
          ? { ok: true, result }
          : { ok: false, error: '요청결과를 불러오지 못했습니다.' }
      );
    } catch {
      return res.send({
        ok: false,
        error: '예기치 못한 오류가 발생하였습니다.',
      });
    }
  }

  getRoute() {
    return this.#route;
  }

  getRouter() {
    // public

    this.#router.get('/', (_, res) =>
      this.#getApi(
        this.#coursesService.findAllCourses({
          select: this.#course,
        }),
        res
      )
    ); // 코스 전체 조회

    this.#router.get('/search', (req, res) =>
      this.#getApi(
        this.#coursesService.searchCourses({
          query: req.query.query?.toString() ?? '',
          select: this.#course,
        }),
        res
      )
    ); // 코스 검색
    this.#router.get('/category/:category_id', (req, res) =>
      this.#getApi(
        this.#coursesService.findCoursesByCategoryId({
          category_id: parseInt(req.params.category_id),
          select: this.#course,
        }),
        res
      )
    ); // 카테고리별 조회

    // login
    this.#router.get('/learning-list', jwtMiddleware, (req, res) =>
      this.#getApi(async () => {
        const student_id = req.user.id;
        const ids = await this.#learnRecordsService.findCourseIdsByStudentId({
          student_id,
        });
        return this.#coursesService.findCoursesByIds({
          ids,
          select: this.#course,
        });
      }, res)
    ); // 수강 코스 조회

    // role.teacher
    this.#router.get(
      '/offering-list',
      jwtMiddleware,
      role('Teacher'),
      (req, res) =>
        this.#getApi(
          this.#coursesService.findCoursesByTeacherId({
            teacher_id: req.user.id,
            select: this.#course,
          }),
          res
        )
    ); // 담당 코스 조회
    this.#router.post('/create', jwtMiddleware, role('Teacher'), (req, res) =>
      this.#getApi(
        async () =>
          this.#coursesService.createCourse({
            data: {
              ...(await getData({ body: req.body, file: req.file })),
              teacher_id: req.user.id,
            },
          }),
        res
      )
    ); // 담당 코스 생성

    this.#router.post(
      '/:course_id/update',
      jwtMiddleware,
      role('Teacher'),
      (req, res) =>
        this.#getApi(
          async () =>
            this.#coursesService.updateCourse({
              where: {
                id: parseInt(req.params.course_id),
                teacher_id: req.user.id,
              },
              data: await getData({ body: req.body, file: req.file }),
            }),
          res
        )
    ); // 담당 코스 수정
    this.#router.post(
      '/:course_id/delete',
      jwtMiddleware,
      role('Teacher'),
      (req, res) =>
        this.#getApi(
          this.#coursesService.deleteCourse({
            id: parseInt(req.params.course_id),
            teacher_id: req.user.id,
          }),
          res
        )
    ); // 담당 코스 삭제

    // public
    this.#router.get('/:course_id', (req, res) =>
      this.#getApi(
        this.#coursesService.findCourseById({
          id: parseInt(req.params.course_id),
          select: this.#course,
        }),
        res
      )
    ); // 코스 기본정본 조회

    // login
    this.#router.get('/:course_id/learn-record', jwtMiddleware, (req, res) =>
      this.#getApi(
        async () => ({
          ...(await this.#learnRecordsService.findLearnRecord({
            where: {
              student_id: req.user.id,
              course_id: parseInt(req.params.course_id),
            },
            select: this.#learnRecord,
          })),
          count_complete_record: await countCompleteRecord({
            student_id: req.user.id,
            course_id: parseInt(req.params.course_id),
          }),
        }),
        res
      )
    ); // 수강 기록 조회
    this.#router.post('/:course_id/learn', jwtMiddleware, (req, res) =>
      this.#getApi(
        this.#learnRecordsService.createLearnRecord({
          student_id: req.user.id,
          course_id: parseInt(req.params.course_id),
        }),
        res
      )
    ); // 수강 신청

    return this.#router;
  }
}
// in app.js, app.use(instance.getRoute(), instance.getRouter());
