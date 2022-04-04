import express from 'express';
import getAllCategory from './categoryController'

const categoryRouter = express.Router();

categoryRouter.get('/all', getAllCategory);

export default categoryRouter;
