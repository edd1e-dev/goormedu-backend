import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { FindOptionsSelect } from 'typeorm';
import LearnRecord from '../entities/learn-record.entity';

export class UpdateLearnRecordData {
  constructor({
    last_learning_date,
    last_lecture_id,
    next_lecture_id,
  }: UpdateLearnRecordData) {
    if (last_learning_date) this.last_learning_date = last_learning_date;
    if (last_lecture_id) this.last_lecture_id = last_lecture_id;
    if (next_lecture_id) this.next_lecture_id = next_lecture_id;
  }

  @IsDate()
  @IsOptional()
  last_learning_date?: Date;
  @IsNumber()
  @IsOptional()
  last_lecture_id?: number;
  @IsNumber()
  @IsOptional()
  next_lecture_id?: number;
}

export class FindLearnRecordDTO {
  where: {
    student_id: number;
    course_id: number;
  };
  select?: FindOptionsSelect<LearnRecord>;
}
export class FindCourseIdsByStudentIdDTO {
  student_id: number;
}
export class CreateLearnRecordDTO {
  student_id: number;
  course_id: number;
}
export class UpdateLearnRecordDTO {
  where: {
    student_id: number;
    course_id: number;
  };
  data: UpdateLearnRecordData;
}
export class DeleteLearnRecordDTO {
  where: {
    student_id: number;
    course_id: number;
  };
}
export class DeleteLearnRecordByStudentIdDTO {
  student_id: number;
}
