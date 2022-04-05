import express from 'express';
import passport from 'passport';
import { handleAuthFailure, handleAuthSuccess } from "../middleware/JwtStrategy";
import { applyEducator, getEducatorAppliedRecord } from './educatorController';

const educatorRouter = express.Router();

educatorRouter.use(passport.authenticate('jwt', { session: false, failWithError: true }), handleAuthSuccess, handleAuthFailure);

educatorRouter.post('/apply', applyEducator);
educatorRouter.get('/mine', getEducatorAppliedRecord);

export default educatorRouter;
