import type { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Lets async route handlers throw; errors go to the error middleware in index.ts */
export const wrap =
  <R extends Request>(fn: (req: R, res: Response) => Promise<unknown>) =>
  (req: R, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };

/** Trimmed, required string from a request body */
export function str(body: any, key: string, { required = true, max = 500 } = {}): string {
  const v = typeof body?.[key] === 'string' ? body[key].trim() : '';
  if (required && !v) throw new HttpError(400, `"${key}" is required.`);
  if (v.length > max) throw new HttpError(400, `"${key}" is too long (max ${max} characters).`);
  return v;
}
