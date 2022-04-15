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

export class FindTempLecturesByCourseIdDTO {
  where: {
    course_id: number;
    teacher_id: number;
  };
  select?: FindOptionsSelect<Lecture>;
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
  constructor({
    chapter_id,
    title,
    video_url,
    content,
    is_public,
  }: CreateLectureData) {
    this.chapter_id = chapter_id;
    this.title = title;
    if (video_url) this.video_url = video_url;
    if (content) this.content = content;
    if (is_public) this.is_public = is_public;
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

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}

export class CreateLectureDTO {
  where: {
    teacher_id: number;
    course_id: number;
    order: number;
  };
  data: CreateLectureData;
}

export class UpdateLectureData {
  constructor({
    chapter_id,
    title,
    video_url,
    content,
    order,
    is_public,
  }: UpdateLectureData) {
    if (chapter_id) this.chapter_id = chapter_id;
    if (title) this.title = title;
    if (order) this.order = order;
    if (video_url) this.video_url = video_url;
    if (content) this.content = content;
    if (is_public) this.is_public = is_public;
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

export class UpdateChapterlessLecutreDTO {
  chapter_id: number;
  teacher_id: number;
}

export class DeleteLectureDTO {
  id: number;
  teacher_id: number;
  course_id: number;
}
