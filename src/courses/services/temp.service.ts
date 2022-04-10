import { IService } from '@/commons/interfaces';

export default class TmpService implements IService {
  async findCourseIdsByStudentId({
    student_id,
  }: {
    student_id: number;
  }): Promise<number[]> {
    return [];
  }

  async findLearnRecord({
    where,
    select,
  }: {
    where: { student_id: number; course_id: number };
    select: object;
  }) {
    return {};
    // LearnRecord를 반환, 없으면 CustomError 반환
  }
  async countCompleteRecord({
    student_id,
    course_id,
  }: {
    student_id: number;
    course_id: number;
  }) {
    return 0;
    // LearnRecord갯수 반환
  }

  async createLearnRecord({
    student_id,
    course_id,
  }: {
    student_id: number;
    course_id: number;
  }) {}

  async deleteChapters({
    where,
  }: {
    where: { course_id: number; teacher_id: number };
  }) {}

  async deleteLectures({
    where,
  }: {
    where: { course_id: number; teacher_id: number };
  }) {}
}
