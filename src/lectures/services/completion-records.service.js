import AppDataSource from '../../db';
import CompletionRecord from '../entities/completion-record.entity';

export default class CompletionRecordsService {
  #completionRecordRepository;
  constructor() {
    this.#completionRecordRepository =
      AppDataSource.getRepository(CompletionRecord);
  }

  async findCompletionRecord({ student_id, lecture_id }) {}
  async countCompletionRecord({ student_id, course_id }) {}
  async createCompletionRecord({ student_id, lecture_id, course_id }) {}
  async deleteCompletionRecord({ student_id, lecture_id }) {}
  async deleteCompletionRecordsByLectureId({ lecture_id }) {}
}
