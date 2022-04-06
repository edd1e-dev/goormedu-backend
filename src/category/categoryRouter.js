import express from 'express';
import getAllCategory from './categoryController'

const categoryRouter = express.Router();

categoryRouter.get('/', getAllCategory);

export default categoryRouter;
