import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '@/logger';

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const isValid = schema.safeParse(req.query);

    if (!isValid.success) {
      res.status(400).json({ error: 'Invalid request parameters', details: isValid.error.issues });

      const { domain, date } = req.query as {
        domain: string
        date: string
      }
      logger.debug({domain, date}, 'Invalid request parameters');
      return;
    }

    next();
  }
}

export const DayQuerySchema = z.object({
  domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  date: z.iso.date(),
});

export const MonthQuerySchema = z.object({
  domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  date: z.string().regex(/^\d{4}-\d{2}$/) // YYYY-MM
});
