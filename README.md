# ConnectU

Campus friend-matching web app for NYU students. Closed network — signup is
restricted to `@nyu.edu` email addresses, verified via one-time passcode (OTP).

## Status

**Phase 1** — repo setup, database schema, and NYU-email + OTP authentication
only. Swipe/match/messaging features are not implemented yet.

## Stack

- **Frontend**: React (Vite), JavaScript
- **Backend**: Node.js + Express, JavaScript
- **Database**: PostgreSQL via Prisma ORM
- **Cache / OTP storage**: Redis
- **Local dev**: Docker Compose
- **CI**: GitHub Actions (lint + test on push/PR)

## Project structure

```
connectu/
├── backend/     # Express API, Prisma schema, auth logic
├── frontend/    # React (Vite) client
└── .github/     # CI workflows
```

## Getting started

1. Copy the environment template and fill in values:

   ```bash
   cp .env.example .env
   ```

2. Start Postgres and Redis:

   ```bash
   docker compose up -d
   ```

3. Install backend dependencies and apply the Prisma schema:

   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   ```

4. Start the backend:

   ```bash
   npm run dev
   ```

5. In a separate terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Auth (Phase 1)

Signup is restricted to `@nyu.edu` addresses. A user submits their NYU email,
receives a one-time passcode, and verifies it to complete signup. OTP
generation/verification and email-sending logic are currently stubbed out
pending a security design review — see `backend/src/services/otp.service.js`
and `backend/src/services/email.service.js`.
