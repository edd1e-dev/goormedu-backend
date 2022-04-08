import express from 'express';
import CategoriesService from './categories.service';

export default class CategoriesController {
  #categoryService;
  #router;
  #route;

  constructor() {
    this.#categoryService = new CategoriesService();
    this.#router = express.Router();
    this.#route = '/categories';
  }

  getRoute() {
    return this.#route;
  }

  getRouter() {
    this.#router.get('/', async (_, res) => {
      try {
        const result = await this.#categoryService.findAllCategories({
          id: true,
          title: true,
        });
        return res.send({ ok: true, result });
      } catch (error) {
        console.log(error);
        return res.send({
          ok: false,
          error: '예기치 못한 에러가 발생하였습니다.',
        });
      }
    });
    return this.#router;
  }
}
