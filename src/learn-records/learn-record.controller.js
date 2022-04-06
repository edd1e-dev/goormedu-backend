import express from 'express';
import LearnRecordService from './learn-records.service';

export default class LearnRecordController {
  #learnRecordService;
  #router;
  constructor() {
    this.#learnRecordService = new LearnRecordService();
    this.#router = express.Router();
  }
  getRouter() {
    this.#router.get('/', fn);
    //미들웨어 등등
    this.#router.get('/example', (req, res) => {
      const student_id = req.user.id;
      const result = this.#learnRecordService.findCourseIds({ student_id });
      return res.send({ result });
    });
    //router 정의
    return this.#router;
  }
}

// app.js에서 클래스 객체 생성한 후 app.use('route',instance.getRouter())형태로 연결
