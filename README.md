# Identitree Monorepo

Monorepo powered by Turborepo with:

- `apps/web`: Next.js 16 frontend (Tailwind CSS v4, shadcn/ui, Better Auth client-side flows)
- `apps/api`: NestJS 11 backend (Better Auth server-side dependencies)
- `packages/ui`: shared UI package
- `packages/eslint-config`: shared ESLint config
- `packages/typescript-config`: shared TS config

## Setup Tutorial

Follow these steps in order for a clean first-time setup.

## Step 1: Install required tools

- Node.js 18+ (Node 20+ recommended)
- npm 11+ (project uses npm workspaces)
- Git
- Turbo CLI (global install)

### Install tools

Windows (using winget):

```powershell
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Git.Git -e
```

macOS (using Homebrew):

```bash
brew install node@20 git
```

Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y nodejs npm git
```

Install Turbo CLI globally:

```bash
npm install -g turbo
```

Verify installations:

```bash
node -v
npm -v
git --version
turbo --version
```

## Step 2: Clone the repository

```bash
git clone https://github.com/Geoplan-Philippines/identitree.git
cd identitree
```

## Step 3: Install dependencies

From repo root:

```bash
npm install
```

## Step 4: Configure environment variables

Create API environment file from the example:

```bash
cp apps/api/.env.example apps/api/.env
```

PowerShell alternative:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

Then update values in `apps/api/.env`:

- `BETTER_AUTH_SECRET`: set a strong secret
- `BETTER_AUTH_URL`: app base URL (for local web this is usually `http://localhost:3000`)

## Step 5: Run the app

Run everything from root with Turbo:

```bash
turbo dev
```

Or use the npm workspace script:

```bash
npm run dev
```

Default local URLs:

- Web: http://localhost:3000
- API: http://localhost:8000

## Step 6: Useful workspace commands

From repo root:

```bash
# Build all workspaces
npm run build

# Lint all workspaces
npm run lint

# Type-check all workspaces
npm run check-types
```

Run a single app:

```bash
# Web only
npm run -w apps/web dev

# API only
npm run -w apps/api dev
```

## Auth routes in web

Basic auth routes are available in the Next.js app:

- `/login`
- `/signup`

## Tech notes

- Tailwind CSS v4 is used in both web and api workspaces.
- shadcn/ui has been initialized in the web app.
- Better Auth packages are installed for auth integration.
