import express from 'express';
import CoursesService from './courses.service';

export default class CoursesController {
  #coursesService;
  #router;
  #route;
  constructor() {
    this.#coursesService = new CoursesService();
    this.#router = express.Router();
    this.#route = 'courses';
  }

  getRoute() {
    return this.#route;
  }

  getRouter() {
    const jwtMiddleware = () => {};
    const role = (...arg) => {};

    // public
    this.#router.get('/search', (req, res) => {}); // 코스 검색
    this.#router.get('/category/:category_id', (req, res) => {}); // 카테고리별 조회

    // login
    this.#router.get('/learning-list', jwtMiddleware, (req, res) => {}); // 수강 코스 조회

    // role.teacher
    this.#router.get(
      '/offering-list',
      jwtMiddleware,
      role('Teacher'),
      (req, res) => {}
    ); // 담당 코스 조회
    this.#router.post(
      '/create',
      jwtMiddleware,
      role('Teacher'),
      (req, res) => {}
    ); // 담당 코스 생성
    this.#router.post(
      '/:course_id/update',
      jwtMiddleware,
      role('Teacher'),
      (req, res) => {}
    ); // 담당 코스 수정
    this.#router.post(
      '/:course_id/delete',
      jwtMiddleware,
      role('Teacher'),
      (req, res) => {}
    ); // 담당 코스 삭제

    // public
    this.#router.get('/:course_id', (req, res) => {}); // 코스 기본정본 조회

    // login
    this.#router.get(
      '/:course_id/learn-record',
      jwtMiddleware,
      (req, res) => {}
    ); // 수강 기록 조회
    this.#router.post('/:course_id/learn', jwtMiddleware, (req, res) => {}); // 수강 신청

    return this.#router;
  }
}
// in app.js, app.use(instance.getRoute(), instance.getRouter());
