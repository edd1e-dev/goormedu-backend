import express from 'express';
import TmpService from './lectures.tmp';
import LecturesService from './services/lectures.service';

export default class LecturesController {
  #lecturesService;
  #router;
  #route;
  #lecture;

  #tmpService;
  constructor() {
    this.#lecturesService = new LecturesService();
    this.#tmpService = new TmpService();

    this.#router = express.Router();
    this.#route = '/lectures';
    this.#lecture = {
      id: true,
      title: true,
      teacher_id: true,
      course_id: true,
      chapter_id: true,
      order: true,
      is_Public: true,
    };
  }

  getRoute() {
    return this.#route;
  }

  getApi() {}

  getRouter() {
    const jwtMiddleware = () => {};
    const role = (...arg) => {};

    this.#router.get('/:chapter_id'); // 챕터 내 강의 리스트
    this.#router.get('/:lecture_id'); // 강의 기본 정보
    this.#router.get('/:lecture_id/completion-record'); // 강의 이수여부 확인
    this.#router.get('/:lecture_id/detail'); //강의
    this.#router.post('/create');
    this.#router.post('/:lecture_id/complete'); // 강의 이수 완료
    this.#router.post('/:lecture_id/update');
    this.#router.post('/:lecture_id/delete');

    return this.#router;
  }
}
