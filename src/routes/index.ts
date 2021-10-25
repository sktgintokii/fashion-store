import express from 'express';
import salesRouter from './sales';

const indexRouter = express.Router();

indexRouter.use('/sales', salesRouter);

export default indexRouter;
