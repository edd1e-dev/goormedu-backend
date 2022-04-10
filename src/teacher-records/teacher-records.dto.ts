import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTeacherRecordData {
  constructor({ career }: CreateTeacherRecordData) {
    this.career = career;
  }
  @IsString()
  career: string;
}

export class UpdateTeacherRecordData {
  constructor({ career, accepted }: UpdateTeacherRecordData) {
    if (accepted) this.accepted = accepted;
    if (career) this.career = career;
  }

  @IsString()
  @IsOptional()
  career?: string;
  @IsBoolean()
  @IsOptional()
  accepted?: boolean;
}

export class CreateTeacherRecordDTO {
  user_id: number;
  data: CreateTeacherRecordData;
}

export class FindTeacherRecordByUserIdDTO {
  user_id: number;
}

export class UpdateTeacherRecordByUserIdDTO {
  user_id: number;
  data: UpdateTeacherRecordData;
}
export class DeleteTeacherRecordByUserIdDTO {
  user_id: number;
}
