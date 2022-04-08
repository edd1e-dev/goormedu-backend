import TeacherRecord from './teacher-records.entity';
import AppDataSource from '../db';

export default class TeacherRecordsService {
  #teacherRecordRepository;

  constructor() {
    this.#teacherRecordRepository = AppDataSource.getRepository(TeacherRecord);
  }

  /**
   * @param {*} student_id User Entity의 id
   * @param {*} career TeacherRecord Entity의 career
   * @returns 성공 시 TeacherRecord Entity 이미 등록되었을 시 -1 다른 실패 시 null
   */
  async createTeacherRecord(student_id, career) {
    try {
      const teacherRecordData = await this.#teacherRecordRepository.findOneBy({
        student_id,
      });
      if (!teacherRecordData) {
        const newTeacherRecord = this.#teacherRecordRepository.create({
          student_id,
          accepted: false,
          career,
        });
        const teacherRecordResult = await this.#teacherRecordRepository.save(
          newTeacherRecord
        );
        return teacherRecordResult;
      } else {
        return -1;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * @param {*} student_id User Entity의 id
   * @returns 성공 시 TeacherRecord Entity 실패 시 null
   */
  async findTeacherRecord(student_id) {
    try {
      const teacherRecord = await this.#teacherRecordRepository.findOneBy({
        student_id,
      });
      if (teacherRecord) {
        return teacherRecord;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
