import type { ErrorRequestHandler, RequestHandler } from 'express';
import { MulterError } from 'multer';
import { HttpError } from '../utils/httpError';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Multer throws its own error class (not HttpError) for upload-level
// problems like exceeding the size limit — map it to a 400 here instead of
// letting it fall through to the generic 500 below.
function toHttpError(err: unknown): HttpError | undefined {
  if (err instanceof HttpError) return err;
  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Photo must be 5MB or smaller.' : err.message;
    return new HttpError(400, message);
  }
  return undefined;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const httpError = toHttpError(err);
  const status = httpError?.status ?? 500;
  const message = status === 500 ? 'Internal server error' : (httpError?.message ?? err.message);

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
};
