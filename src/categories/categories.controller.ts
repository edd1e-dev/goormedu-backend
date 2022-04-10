import { CategoryData } from './categories.dto';
import { CustomError, IController, UserRole } from '@/commons/interfaces';
import JwtGuard from '@/middleware/jwt.guard';
import RoleGuard from '@/middleware/role.guard';
import express, { Response, Router } from 'express';
import CategoriesService from './categories.service';
import { validate } from 'class-validator';

export default class CategoriesController implements IController {
  public readonly route: string;
  private readonly categoriesService: CategoriesService;
  private readonly router: Router;

  constructor() {
    this.categoriesService = new CategoriesService();
    this.router = express.Router();
    this.route = '/categories';
  }

  private async getApi(service: Function, res: Response) {
    try {
      const result: object | null = await service();
      return res.send(
        result
          ? { ok: true, result }
          : { ok: false, error: '요청 결과를 불러오지 못했습니다.' },
      );
    } catch (e) {
      let error = CustomError.UnExpectedErrorMessage;
      if (e.name === CustomError.ErrorType) error = e.message;
      return res.send({ ok: false, error });
    }
  }

  getRouter() {
    this.router.get('/', (_, res) =>
      this.getApi(() => this.categoriesService.findAllCategories(), res),
    );
    this.router.get('/:category_id', (req, res) =>
      this.getApi(
        () =>
          this.categoriesService.findCategoryById({
            id: parseInt(req.params.category_id),
          }),
        res,
      ),
    );

    this.router.use(JwtGuard, RoleGuard(UserRole.Admin));

    this.router.post('/create', (req, res) =>
      this.getApi(async () => {
        const data = new CategoryData(req.body);
        const errors = await validate(data, { whitelist: true });
        if (errors.length) {
          throw new CustomError('잘못된 값이 전달되었습니다.');
        }

        const result = await this.categoriesService.createCategory(data);
        return result;
      }, res),
    );

    this.router.post('/:category_id/update', (req, res) =>
      this.getApi(async () => {
        const data = new CategoryData(req.body);
        const errors = await validate(data, { whitelist: true });
        if (errors.length) {
          throw new CustomError('잘못된 값이 전달되었습니다.');
        }
        const result = await this.categoriesService.updateCategoryById({
          id: parseInt(req.params.category_id),
          data,
        });
        return result;
      }, res),
    );
    this.router.post('/:category_id/delete', (req, res) =>
      this.getApi(
        () =>
          this.categoriesService.deleteCategoryById({
            id: parseInt(req.params.category_id),
          }),
        res,
      ),
    );
    return this.router;
  }
}
