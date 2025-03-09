// apps/backend/src/middleware/delay.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function delay(req: Request, res: Response, next: NextFunction): void {
  setTimeout(() => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
    }
    next();
  }, 1000);
}

