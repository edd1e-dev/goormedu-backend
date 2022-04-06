import LearnRecordService from './learn-records.service';

export default class LearnRecordController {
  #learnRecordService;
  constructor() {
    this.#learnRecordService = new LearnRecordService();
  }

  async fn() {
    this.#learnRecordService.findCourseIds();
  }
}
