# Identitree Web

Next.js frontend for Identitree. This app provides:

- Better Auth client-side sign-in and sign-up flows
- cookie-backed session hydration
- public and protected route guards
- organization setup and dashboard routes
- a shared API client for backend requests

## Setup

### 1. Install dependencies

From the repo root:

```bash
npm install
```

Or from this package:

```bash
cd apps/web
npm install
```

### 2. Create your environment file

Copy the example file:

```bash
cp apps/web/.env.example apps/web/.env
```

PowerShell:

```powershell
Copy-Item apps/web/.env.example apps/web/.env
```

Then update `apps/web/.env`:

- `NEXT_PUBLIC_API_BASE_URL`: versioned backend API base URL, usually `http://localhost:8000/api/v1`

The frontend reads this value through one shared helper:

- `apps/web/lib/api/config.ts`

### 3. Run the web app

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
npm run start
```

Type checking:

```bash
npm run check-types
```

Linting:

```bash
npm run lint
```

Default local web URL:

```text
http://localhost:3000
```

## Routes

The app includes these routes:

- `/` public homepage
- `/login` sign-in page
- `/signup` sign-up page
- `/organization/setup` organization setup flow
- `/dashboard` dashboard entry point
- `/dashboard/[slug]` organization dashboard route

## Auth flow

The frontend uses Better Auth through `apps/web/lib/auth-client.ts` and the shared API client in `apps/web/lib/api/client.ts`.

The login and signup forms call the backend auth endpoints and also support Google sign-in.

The auth provider hydrates the current session from cookies and keeps auth state in memory instead of localStorage.

## Notes

- The app uses the Next.js App Router.
- Shared UI components live under `apps/web/components`.
- The backend must be running on `NEXT_PUBLIC_API_BASE_URL` for auth and org lookups to work.
