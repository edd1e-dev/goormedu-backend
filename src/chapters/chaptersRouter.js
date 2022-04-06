import express from 'express';
import passport from 'passport';
import { getChapterByCourseId } from './chaptersController';

const chaptersRouter = express.Router();

chaptersRouter.post('/', getChapterByCourseId);

export default chaptersRouter;
