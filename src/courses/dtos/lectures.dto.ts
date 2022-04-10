import {
  IsNumber,
  IsString,
  IsUrl,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { FindOptionsSelect } from 'typeorm';
import Lecture from '../entities/lecture.entity';
export class DeleteLecturesDTO {
  course_id: number;
  teacher_id: number;
}

export class FindLecturesByChapterIdDTO {
  chapter_id: number;
  select?: FindOptionsSelect<Lecture>;
}

export class FindLectureByIdDTO {
  id: number;
  select?: FindOptionsSelect<Lecture>;
}

export class CreateLectureData {
  constructor(data: CreateLectureData) {
    for (const [key, val] of Object.entries(data)) this[key] = val;
  }

  @IsNumber()
  chapter_id: number;

  @IsString()
  title: string;

  @IsUrl()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  order: number;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}

export class CreateLectureDTO {
  where: {
    teacher_id: number;
    course_id: number;
  };
  data: CreateLectureData;
}

export class UpdateLectureData {
  constructor(data: UpdateLectureData) {
    for (const [key, val] of Object.entries(data)) this[key] = val;
  }

  @IsNumber()
  @IsOptional()
  chapter_id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsUrl()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}

export class UpdateLectureDTO {
  where: { id: number; teacher_id: number; course_id: number };
  data: UpdateLectureData;
}

export class DeleteLectureDTO {
  id: number;
  teacher_id: number;
  course_id: number;
}
