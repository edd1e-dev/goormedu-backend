import { IsString } from 'class-validator';

export class CategoryData {
  constructor({ name }: CategoryData) {
    this.name = name;
  }
  @IsString()
  name: string;
}
export class CreateCategoryDTO extends CategoryData {}

export class FindCategoryByIdDTO {
  id: number;
}

export class UpdateCategoryByIdDTO {
  id: number;
  data: CategoryData;
}

export class DeleteCategoryByIdDTO {
  id: number;
}
