import type { NextFunction, Request, Response } from 'express';

/**
 * Final error middleware - consistent JSON shape for unexpected failures.
 * Four args are required so Express treats this as error middleware.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  console.error(error);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    },
  });
}
