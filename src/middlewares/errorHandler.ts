import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): any => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors,
    });
  }

  // Handle other errors (e.g., AppError)
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(status).json({
    status: 'error',
    statusCode: status,
    message,
  });
};
