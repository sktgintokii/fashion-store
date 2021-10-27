import { NextFunction, Request, RequestHandler, Response } from 'express';

export const wrapAsyncHandler =
  (
    asyncFunc: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    asyncFunc(req, res, next).catch(next);
  };
