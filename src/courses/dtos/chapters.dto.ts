import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FindOptionsSelect } from 'typeorm';
import Chapter from '../entities/chapter.entity';

export class FindChaptersByCourseId {
  course_id: number;
  select?: FindOptionsSelect<Chapter>;
}

export class DeleteChaptersDTO {
  course_id: number;
  teacher_id: number;
}

export class CreateChapterData {
  constructor({ title }: CreateChapterData) {
    this.title = title;
  }

  @IsString()
  title: string;
}

export class CreateChapterDTO {
  where: { course_id: number; teacher_id: number; order: number };
  data: CreateChapterData;
}

export class UpdateChapterData {
  constructor({ title, order }: UpdateChapterData) {
    if (title) this.title = title;
    if (order) this.order = order;
  }

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateChapterDTO {
  where: { id: number; teacher_id: number };
  data: UpdateChapterData;
}

export class DeleteChapterDTO {
  id: number;
  teacher_id: number;
}
