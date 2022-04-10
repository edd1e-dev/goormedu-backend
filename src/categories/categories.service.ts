import {
  CreateCategoryDTO,
  DeleteCategoryByIdDTO,
  FindCategoryByIdDTO,
  UpdateCategoryByIdDTO,
} from './categories.dto';
import Category from './category.entity';
import AppDataSource from '@/commons/db';
import { CustomError, IService } from '@/commons/interfaces';
import { Repository } from 'typeorm';

export default class CategoriesService implements IService {
  private readonly categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  findAllCategories() {
    return this.categoryRepository.find();
  }

  async findCategoryById({ id }: FindCategoryByIdDTO): Promise<Category> {
    const result = await this.categoryRepository.findOne({ where: { id } });
    if (!result) {
      throw new CustomError('카테고리가 존재하지 않습니다.');
    }
    return result;
  }
  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const result = await this.categoryRepository.save(
      this.categoryRepository.create(data),
    );
    return result;
  }
  async updateCategoryById({
    id,
    data,
  }: UpdateCategoryByIdDTO): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (category) {
      category.name = data.name;
      const result = await this.categoryRepository.save(category);
      return result;
    } else {
      throw new CustomError('카테고리가 존재하지 않습니다.');
    }
  }
  async deleteCategoryById({
    id,
  }: DeleteCategoryByIdDTO): Promise<{ id: number }> {
    await this.categoryRepository.delete({ id });
    return { id };
  }
}
