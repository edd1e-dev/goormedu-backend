import express from 'express';
import ChaptersService from './chapters.service';

export default class ChaptersController {
  #chapterService;
  #router;
  #route;

  constructor() {
    this.#chapterService = new ChaptersService();
    this.#router = express.Router();
    this.#route = '/chapters';
  }

  getRoute() {
    return this.#route;
  }

  getRouter() {
    this.#router.post('/', async (req, res) => {
      try {
        const course_id = parseInt(req.body?.course_id ?? '0');
        const courseData = await this.#chapterService.findCourseByCourseId(
          course_id
        );

        if (!courseData) {
          return res.send({
            ok: false,
            error: '존재하지 않는 코스입니다.',
          });
        }

        const chapterData = await this.#chapterService.findChaptersByCourseId(
          course_id,
          {
            id: true,
            title: true,
            course_id: true,
            order: true,
          }
        );
        if (chapterData) {
          const lectureData = await this.#chapterService.findLecturesByCourseId(
            chapterData,
            course_id
          );

          if (lectureData) {
            return res.send({ ok: true, result: lectureData });
          } else {
            return res.send({
              ok: false,
              error: '존재하지 않는 강의입니다.',
            });
          }
        } else {
          return res.send({
            ok: false,
            error: '존재하지 않는 챕터입니다.',
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
    return this.#router;
  }
}
