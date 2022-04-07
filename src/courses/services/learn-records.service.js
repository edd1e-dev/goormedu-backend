import AppDataSource from '../../db';
import LearnRecord from '../entities/learn-record.entity';

export default class LearnRecordsService {
  #learnRecordRepository;
  constructor() {
    this.#learnRecordRepository = AppDataSource.getRepository(LearnRecord);
  }

  /**
   * 특정 사용자의 특정 강의에 대한 수강 기록 조회
   * @param where LearnRecord 조회 기준, student_id, course_id를 포함
   * @param select 조회결과에 포함될 데이터 정의
   * @returns 성공시 LearnRecord, 실패시 null
   */
  async findLearnRecord({ where, select }) {
    try {
      const { student_id, course_id } = where; // validation
      const result = await this.#learnRecordRepository.findOneOrFail({
        where: { student_id, course_id },
        ...(select && { select }),
      });
      return result;
    } catch {}
    return null;
  }

  /**
   * 학생이 수강한 course의 id를 조회
   * @param student_id
   * @returns 성공시 number[], 실패시 null
   */
  async findCourseIdsByStudentId({ student_id }) {
    try {
      const result = await this.#learnRecordRepository.find({
        where: {
          student_id,
        },
        select: { course_id },
      });
      return result.map((la) => la.course_id);
    } catch {
      return null;
    }
  }

  /**
   * @param data LearnRecord 생성 기준, student_id, course_id
   * @returns 성공시 LearnRecord, 실패시 null
   */
  async createLearnRecord(data) {
    try {
      const { student_id, course_id } = data; // validation
      const result = this.#learnRecordRepository.save(
        this.#learnRecordRepository.create({ student_id, course_id })
      );
      return result;
    } catch {}
    return null;
  }

  /**
   * @param where LearnRecord 조회 기준
   * @param data 변경할 데이터
   * @returns 성공시 LearnRecord, 실패시 null
   */
  async updateLearnRecord({
    where: { student_id, course_id },
    data, // : { last_learning_date, last_lecture_id, next_lecture_id },
  }) {
    try {
      const learnRecord = await this.#learnRecordRepository.findOneByOrFail({
        student_id,
        course_id,
      });
      for (const [key, val] of Object.entries(data)) {
        learnRecord[key] = val;
      }
      const result = await this.#learnRecordRepository.save(learnRecord);
      return result;
    } catch {}
    return null;
  }

  /**
   * @param where LearnRecord 조회 기준
   * @returns 성공시 where, 실패시 null
   */
  async deleteLearnRecord(where) {
    try {
      const { student_id, course_id } = data; // validation
      await this.#learnRecordRepository.delete({ student_id, course_id });
      return where;
    } catch {}
    return null;
  }
}
