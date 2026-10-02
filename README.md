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

## Seed data (dev only)

`backend/prisma/seed.ts` is a standalone script — not a migration, not
wired into any app logic — that creates ~18 fake-but-realistic onboarded
NYU student profiles so the discovery/swipe feed has real candidates to
test against locally. It's safe to re-run and has nothing to do with
production data; delete `backend/prisma/seed.ts` if it's ever in the way.

```bash
cd backend
npx prisma db seed          # create/update the sample profiles
npx prisma db seed -- --clear   # remove exactly those sample profiles
```

`--clear` deletes only the users this script created (matched by their
`nyuEmail`) — their swipes/matches go with them automatically — and never
touches accounts created through the real signup flow.

## Auth (Phase 1)

Signup is restricted to `@nyu.edu` addresses. A user submits their NYU email,
receives a one-time passcode, and verifies it to complete signup. OTP
generation/verification and email-sending logic are currently stubbed out
pending a security design review — see `backend/src/services/otp.service.js`
and `backend/src/services/email.service.js`.
