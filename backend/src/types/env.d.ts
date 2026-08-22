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

      // Object storage (Cloudflare R2, or an S3-compatible substitute like
      // MinIO for local dev — see docker-compose.yml).
      R2_ACCOUNT_ID?: string;
      R2_ACCESS_KEY_ID?: string;
      R2_SECRET_ACCESS_KEY?: string;
      R2_BUCKET_NAME?: string;
      // Base URL photos are served from once uploaded, e.g. a public R2.dev
      // subdomain, a custom domain in front of the bucket, or the local
      // MinIO endpoint. Object keys are appended directly to this.
      R2_PUBLIC_URL?: string;
      // Optional override for the S3-compatible endpoint. Required for
      // MinIO (e.g. http://localhost:9000); omit for real R2, where it's
      // derived from R2_ACCOUNT_ID.
      R2_ENDPOINT?: string;
    }
  }
}
