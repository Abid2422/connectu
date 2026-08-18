export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL: string;
      REDIS_URL?: string;
      RESEND_API_KEY?: string;
      EMAIL_FROM?: string;
      SESSION_SECRET: string;
      FRONTEND_ORIGIN?: string;
    }
  }
}
