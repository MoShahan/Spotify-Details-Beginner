import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type RequestTarget = 'body' | 'params' | 'query';

export function validateRequest<T>(
  schema: ZodType<T>,
  target: RequestTarget = 'body',
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join('; ');

      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message,
          details: result.error.flatten(),
        },
      });
      return;
    }

    if (target === 'body') {
      req.body = result.data;
    } else if (target === 'params') {
      req.params = result.data as Request['params'];
    } else {
      req.query = result.data as Request['query'];
    }

    next();
  };
}
