import AppDataSource from '../db';
import LearnRecord from './learn-record.entity';

export default class LearnRecordsService {
  #learnRecordRepository;
  constructor() {
    this.#learnRecordRepository = AppDataSource.getRepository(LearnRecord);
  }

  /**
   * @param where LearnRecord 조회 기준
   * where은 student_id:number, course_id:number를 property로 갖음
   * @returns 성공시 LearnRecord, 실패시 null
   */
  async findLearnRecord(where) {
    try {
      const { student_id, course_id } = where; // validation
      const result = await this.#learnRecordRepository.findOneByOrFail({
        student_id,
        course_id,
      });
      return result;
    } catch {}
    return null;
  }

  /**
   * select course_id from LearnRecord where criteria
   * @param criteria 조회 기준이 될 값이 들어감, {course_id:number}|{student_id:number}
   * @returns number[] courseId 배열
   */
  async findCourseIds(criteria) {
    try {
      const { student_id, course_id } = criteria;
      const result = await this.#learnRecordRepository.find({
        where: {
          ...(student_id && { student_id }),
          ...(course_id && { course_id }),
        },
        select: { course_id },
      });
      return result.flat();
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
