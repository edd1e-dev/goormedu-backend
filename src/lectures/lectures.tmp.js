import AppDataSource from '../db';

export default class TmpService {
  // 다른 서비스에서 제공받을 임시 함수들

  // completionRecords에서
  async findCompletionByStudentIdAndLectureId(student_id, lecture_id) {}

  // learnRecords에서
  async findLearnRecordByStudentIdAndCourseId(student_id, course_id) {}

  // Course에서
  async findCourseTeacherRecordByCourseId(course_id) {}
}
