import type { SessionTokenPayload } from '../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: SessionTokenPayload;
    }
  }
}

export {};
