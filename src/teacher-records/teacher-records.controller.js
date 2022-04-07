import express from 'express';
import passport from 'passport';
import {
  handleAuthFailure,
  handleAuthSuccess,
} from '../middleware/JwtStrategy';
import TeacherRecordsService from './teacher-records.service';

export default class TeacherRecordsController {
  #teacherRecordService;
  #router;

  constructor() {
    this.#teacherRecordService = new TeacherRecordsService();
    this.#router = express.Router();
  }

  getRouter() {
    this.#router.use(
      passport.authenticate('jwt', { session: false, failWithError: true }),
      handleAuthSuccess,
      handleAuthFailure
    );

    this.#router.post('/create', async (req, res) => {
      try {
        const student_id = parseInt(req.user.id ?? '0');
        const career = req.body?.career ?? '';
        const teacherRecordData =
          await this.#teacherRecordService.createTeacherRecord(
            student_id,
            career
          );
        if (teacherRecordData === -1) {
          return res.send({
            ok: true,
            error: '이미 신청한 상태이거나 교육자입니다.',
          });
        } else if (!teacherRecordData) {
          return res.send({
            ok: false,
            error: '예기치 못한 에러가 발생하였습니다.',
          });
        }
        return res.send({ ok: true, result: teacherRecordData });
      } catch {
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    });

    this.#router.get('/', async (req, res) => {
      try {
        const student_id = parseInt(req.user.id ?? '0');
        const teacherRecordData =
          await this.#teacherRecordService.findTeacherRecord(student_id);
        return res.send({ ok: true, result: teacherRecordData });
      } catch {
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    });

    return this.#router;
  }
}
