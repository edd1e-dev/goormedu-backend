import express from 'express';
import LecturesService from './lectures.service';
import OtherTmpService from './lectures.tmp';

import { UserRole } from '../users/UserRole';

export default class LecturesController {
  #lecturesService;
  #otherTmpService;

  #router;
  #route;
  constructor() {
    this.#lecturesService = new LecturesService();

    // 임시적으로 생성한 tmp service
    this.#otherTmpService = new OtherTmpService();
    this.#router = express.Router();
    this.#route = '/lectures';
  }

  getRoute() {
    return this.#route;
  }

  getRouter() {
    const jwtMiddleware = () => {};
    const role = (...arg) => {};

    // public
    this.#router.get('/:lecture_id', (req, res) => {
      const lecture_id = parseInt(req.params?.id ?? '0');
      const {
        course_id,
        chapter_id,
        video_url,
        createdAt,
        updatedAt,
        content,
        ...result
      } = this.#lecturesService.findLectureByLectureId(lecture_id);
      return res.send({ ok: true, result });
    }); // 일반적인 렉처 정보 조회

    // login
    this.#router.get('/:lecture_id/completion', jwtMiddleware, (req, res) => {
      try {
        const lecture_id = parseInt(req.params?.id ?? '0');
        const student_id = req.user.id;
        const result =
          this.#otherTmpService.findCompletionByStudentIdAndLectureId(
            student_id,
            lecture_id
          );
        return res.send({ ok: true, result });
      } catch {
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    }); // 렉처 완료 여부 조회
    this.#router.get('/:lecture_id/detail', jwtMiddleware, (req, res) => {
      try {
        const lecture_id = parseInt(req.params?.id ?? '0');
        const student_id = req.user.id;

        const { course_id, chapter_id, createdAt, updatedAt, ...result } =
          this.#lecturesService.findLectureByLectureId(lecture_id);

        // 다른 서비스에서 코스 수강생인지 확인
        const learnRecord =
          this.#otherTmpService.findLearnRecordByStudentIdAndCourseId(
            student_id,
            result.course_id
          );

        if (!learnRecord) {
          return res.send({
            ok: false,
            error: '수강중인 코스가 아닙니다.',
          });
        }

        return res.send({ ok: true, result });
      } catch {
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    }); // 렉처 시청을 위한 디테일 정보 조회
    this.#router.post('/:lecture_id/complete', jwtMiddleware, (req, res) => {
      try {
        // 미구현 서비스 요청도 미구현
      } catch {
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    }); // 수강 렉처 완료 요청

    // role.teacher
    this.#router.post(
      '/create',
      jwtMiddleware,
      // multer middleware도 적용해야 함
      role(UserRole.Teacher),
      (req, res) => {
        try {
          const teacher_id = req.user.id;

          const { course_id, body } = req.body;

          const teacherPermission =
            this.#otherTmpService.findCourseTeacherRecordByCourseId(course_id);

          if (teacher_id !== teacherPermission) {
            return res.send({
              ok: false,
              error: '권한이 없습니다.',
            });
          }

          const result = this.#lecturesService.createLecture(req.body);
          return res.send({ ok: true, result });
        } catch {
          return res.send({
            ok: false,
            error: '예기치 못한 에러가 발생하였습니다.',
          });
        }
      }
    ); // 담당 렉처 생성
    this.#router.post(
      '/:lecture_id/update',
      jwtMiddleware,
      // multer middleware도 적용해야 함
      role(UserRole.Teacher),
      (req, res) => {
        try {
          const teacher_id = req.user.id;
          const lecture_id = parseInt(req.params?.id ?? '0');

          const { course_id, body } = req.body;

          const teacherPermission =
            this.#otherTmpService.findCourseTeacherRecordByCourseId(course_id);

          if (teacher_id !== teacherPermission) {
            return res.send({
              ok: false,
              error: '권한이 없습니다.',
            });
          }

          const result = this.#lecturesService.updateLectureById(
            lecture_id,
            body
          );
          res.send({ ok: false, result });
        } catch {
          return res.send({
            ok: false,
            error: '예기치 못한 에러가 발생하였습니다.',
          });
        }
      }
    ); // 담당 렉처 수정
    this.#router.post(
      '/:lecture_id/delete',
      jwtMiddleware,
      // multer middleware도 적용해야 함
      role(UserRole.Teacher),
      (req, res) => {
        try {
          const teacher_id = req.user.id;
          const lecture_id = parseInt(req.params?.id ?? '0');

          const { course_id, body } = req.body;

          const teacherPermission =
            this.#otherTmpService.findCourseTeacherRecordByCourseId(course_id);

          if (teacher_id !== teacherPermission) {
            return res.send({
              ok: false,
              error: '권한이 없습니다.',
            });
          }

          const result = this.#lecturesService.deleteLectureById(lecture_id);
          res.send({ ok: true, result });
        } catch {
          return res.send({
            ok: false,
            error: '예기치 못한 에러가 발생하였습니다.',
          });
        }
      }
    ); // 담당 렉처 삭제

    return this.#router;
  }
}
