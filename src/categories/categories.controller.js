import Category from "./categories.entity";
import AppDataSource from "../db";

export default class CategoriesService {
  #categoryRepository;

  constructor() {
    this.#categoryRepository = AppDataSource.getRepository(Category);
  }

  /**
   * @param select Categories 조회 결과 형식을 지정
   * @returns 성공 시 Categories 실패 시 null
   */
  async findAllCategories(select) {
    try {
      const result = await this.#categoryRepository.find( { select });
      return result;
    } catch {
      return null;
    }
  }
}