import express from 'express';
import CategoriesService from './categories.controller'

export default class CategoriesController {
    #categoryService;
    #router;

    constructor() {
        this.#categoryService = new CategoriesService();
        this.#router = express.Router();
    }

    getRouter() {
        this.#router.get('/', (req, res) => {
            try {
                const result = this.#categoryService.findAllCategories(['id', 'title']);
                return res.send({ ok: true, result });
              } catch {
                return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
              }
        });
        return this.#router;
    }
}