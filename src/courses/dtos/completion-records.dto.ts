import CompletionRecord from '../entities/completion-record.entitiy';
import { FindOptionsSelect } from 'typeorm';
import { number } from 'joi';

export class FindCompletionRecordDTO {
  where: {
    student_id: number;
    lecture_id: number;
    course_id: number;
  };
  select?: FindOptionsSelect<CompletionRecord>;
}

export class CreateCompletionRecordDTO {
  student_id: number;
  lecture_id: number;
  course_id: number;
}

export class CountCompletionRecordDTO {
  student_id: number;
  course_id: number;
}

export class DeleteCompletionRecordDTO {
  lecture_id: number;
}

export class DeleteCompletionRecordByStudentIdDTO {
  student_id: number;
}
