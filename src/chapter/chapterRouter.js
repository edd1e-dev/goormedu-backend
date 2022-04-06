import express from 'express';
import passport from 'passport';
import { getChapterByCourseId } from './chapterController';

const chapterRouter = express.Router();

chapterRouter.post('/', getChapterByCourseId);

export default chapterRouter;
