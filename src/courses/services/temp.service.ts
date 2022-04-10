import { IService } from '@/commons/interfaces';

export default class TmpService implements IService {
  // CompletionRecord Service
  async countCompletionRecord({
    student_id,
    course_id,
  }: {
    student_id: number;
    course_id: number;
  }) {
    return 0;
    // LearnRecord갯수 반환
  }
}
