import {
  IsNumber,
  IsString,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsArray,
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
  constructor({ chapter_id, title, content, is_public }: CreateLectureData) {
    this.chapter_id = chapter_id;
    this.title = title;
    if (content) this.content = content;
    if (is_public) this.is_public = is_public;
  }

  @IsNumber()
  chapter_id: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}

export class CreateLectureDataWithVideoUrl {
  constructor({
    chapter_id,
    title,
    video_url,
    content,
    is_public,
  }: CreateLectureDataWithVideoUrl) {
    this.chapter_id = chapter_id;
    this.title = title;
    this.video_url = video_url;
    if (content) this.content = content;
    if (is_public) this.is_public = is_public;
  }

  @IsNumber()
  chapter_id: number;

  @IsString()
  title: string;

  @IsUrl()
  video_url: string;

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

export class CreateLectureWithVideoUrlDTO {
  where: {
    teacher_id: number;
    course_id: number;
    order: number;
  };
  data: CreateLectureDataWithVideoUrl;
}

export class UpdateLectureData {
  constructor({
    chapter_id,
    title,
    content,
    is_public,
    order,
  }: UpdateLectureData) {
    if (chapter_id) this.chapter_id = chapter_id;
    if (title) this.title = title;
    if (content) this.content = content;
    if (is_public) this.is_public = is_public;
    if (order || order === 0) this.order = order;
  }

  @IsNumber()
  @IsOptional()
  chapter_id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
export class UpdateLectureDataWithVideUrl {
  constructor({
    chapter_id,
    title,
    video_url,
    content,
    is_public,
    order,
  }: UpdateLectureDataWithVideUrl) {
    this.video_url = video_url;
    if (chapter_id) this.chapter_id = chapter_id;
    if (title) this.title = title;
    if (content) this.content = content;
    if (is_public) this.is_public = is_public;
    if (order) this.order = order;
  }

  @IsNumber()
  @IsOptional()
  chapter_id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsUrl()
  video_url: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateLectureDTO {
  where: { id: number; teacher_id: number; course_id: number };
  data: UpdateLectureData;
}

export class UpdateLectureWithVideoUrlDTO {
  where: { id: number; teacher_id: number; course_id: number };
  data: UpdateLectureDataWithVideUrl;
}

export class UpdateLecturesOrderData {
  constructor({ lectures }: UpdateLecturesOrderData) {
    this.lectures = lectures;
  }

  @IsArray()
  @IsNumber({}, { each: true })
  lectures: number[];
}

export class UpdateLectureOrdersDTO {
  teacher_id: number;
  data: UpdateLecturesOrderData;
}

export class DeleteLectureDTO {
  id: number;
  teacher_id: number;
  course_id: number;
}
