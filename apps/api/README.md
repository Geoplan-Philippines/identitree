# Identitree API

NestJS backend for Identitree. This service provides:

- Better Auth email/password and Google OAuth
- Prisma/PostgreSQL data access
- organization lookup and creation endpoints
- the shared auth session endpoint used by the web app

## Setup

### 1. Install dependencies

From the repo root:

```bash
npm install
```

Or from this package:

```bash
cd apps/api
npm install
```

### 2. Create your environment file

Copy the example file:

```bash
cp apps/api/.env.example apps/api/.env
```

PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

Then update `apps/api/.env`:

- `BETTER_AUTH_SECRET`: a strong random secret
- `BETTER_AUTH_URL`: backend origin without `/api/v1`, usually `http://localhost:8000`
- `PORT`: backend port, usually `8000`
- `FRONTEND_URL`: frontend base URL, usually `http://localhost:3000`
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `RESEND_API_KEY`: Resend API key
- `RESEND_FROM_EMAIL`: sender value, for example `Identitree <noreply@your-domain.com>`
- `RESEND_VERIFY_TEMPLATE_ID`: published Resend template id or alias used for verification emails
- `DATABASE_URL`: PostgreSQL connection string

Resend notes:

- The sender domain in `RESEND_FROM_EMAIL` must be verified in the same Resend project as the API key.
- If `RESEND_VERIFY_TEMPLATE_ID` is set, verification emails are sent using the published template and template variables.
- If `RESEND_VERIFY_TEMPLATE_ID` is empty, the API falls back to the built-in HTML/text verification email.

For local Google OAuth, the redirect URI should be:

```text
http://localhost:8000/api/v1/auth/callback/google
```

### 3. Prepare the database

This project uses Prisma with PostgreSQL.

If you are starting from a clean database, run the migration history that is already checked in:

```bash
npx prisma migrate deploy
```

If you need to regenerate the Prisma client:

```bash
npx prisma generate
```

If you changed `prisma/schema.prisma` and want to create a new migration in development:

```bash
npx prisma migrate dev --name your_migration_name
```

Example:

```bash
npx prisma migrate dev --name add_auth_indexes
```

This command creates a migration file, applies it to your local database, and updates Prisma Client.

If you need to re-migrate your local database (drop data, reapply all migrations, and reseed schema state):

```bash
npx prisma migrate reset --force
npx prisma migrate deploy
npx prisma generate
```

Use this only in local/dev environments because `migrate reset` destroys existing data.

To apply existing migrations in non-dev environments (without creating a new one), use:

```bash
npx prisma migrate deploy
```

If you want to clear local data during development, use the provided script:

```bash
npm run db:clear -- --force
```

## Run the API

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Production start:

```bash
npm run start:prod
```

Default local API URL:

```text
http://localhost:8000/api/v1
```

## Auth routes

Better Auth is mounted under `/api/v1/auth`.

Common routes used by the web app include:

- `POST /api/v1/auth/sign-up/email`
- `POST /api/v1/auth/sign-in/email`
- `GET /api/v1/auth/get-session`
- `GET /api/v1/auth/callback/google`

## Project scripts

From `apps/api`:

```bash
npm run dev
npm run build
npm run start
npm run start:prod
npm run lint
npm run test
npm run test:e2e
npm run db:clear -- --force
```

## Notes

- The backend uses a centralized `DatabaseService`.
- `prisma.config.ts` reads `DATABASE_URL` through `dotenv`.
- The frontend should point to this service through `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`.
