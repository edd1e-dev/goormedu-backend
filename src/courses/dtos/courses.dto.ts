import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { FindOptionsSelect } from 'typeorm';
import Course from '../entities/course.entity';

export class CreateCourseData {
  constructor({ category_id, title, description, level }: CreateCourseData) {
    this.category_id = category_id;
    this.description = description;
    this.level = level;
    this.title = title;
  }

  @IsNumber()
  category_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Max(5)
  @Min(1)
  level: number;
}

export class CreateCourseDataWithCoverImage {
  constructor({
    category_id,
    title,
    description,
    level,
    cover_image,
  }: CreateCourseDataWithCoverImage) {
    this.category_id = category_id;
    this.cover_image = cover_image;
    this.description = description;
    this.level = level;
    this.title = title;
  }

  @IsNumber()
  category_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Max(5)
  @Min(1)
  level: number;

  @IsUrl()
  cover_image: string;
}

export class CreateCourseDTO {
  teacher_id: number;
  data: CreateCourseDataWithCoverImage;
}

export class UpdateCourseData {
  constructor({ category_id, title, description, level }: UpdateCourseData) {
    if (category_id) this.category_id = category_id;
    if (description) this.description = description;
    if (level) this.level = level;
    if (title) this.title = title;
  }

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  level?: number;
}

export class UpdateCourseDataWithCoverImage {
  constructor({
    category_id,
    title,
    description,
    level,
    cover_image,
  }: UpdateCourseDataWithCoverImage) {
    if (category_id) this.category_id = category_id;
    if (description) this.description = description;
    if (level) this.level = level;
    if (title) this.title = title;
    this.cover_image = cover_image;
  }

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  level?: number;

  @IsUrl()
  cover_image: string;
}

export class UpdateCourseDTO {
  where: {
    id: number;
    teacher_id: number;
  };
  data: UpdateCourseData;
}

export class UpdateCourseWithCoverImageDTO {
  where: {
    id: number;
    teacher_id: number;
  };
  data: UpdateCourseDataWithCoverImage;
}

export class FindAllCoursesDTO {
  select?: FindOptionsSelect<Course>;
}

export class FindCoursesByQueryDTO {
  query: string;
  select?: FindOptionsSelect<Course>;
}

export class FindCoursesByCategoryId {
  category_id: number;
  select?: FindOptionsSelect<Course>;
}

export class FindCoursesByIdsDTO {
  ids: number[];
  select?: FindOptionsSelect<Course>;
}

export class FindCoursesByTeacherIdDTO {
  teacher_id: number;
  select?: FindOptionsSelect<Course>;
}

export class FindCourseByIdDTO {
  id: number;
  select?: FindOptionsSelect<Course>;
}

export class DeleteCourseDTO {
  id: number;
  teacher_id: number;
}

export class CheckCourseOwnerDTO {
  id: number;
  teacher_id: number;
}