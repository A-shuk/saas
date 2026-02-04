# saas

Visit the Production Website: https://saas-isrvfzgqz-arushs-projects-8c78b9d9.vercel.app

saas is a Next.js / React application that uses Supabase as its database and Clerk for authentication. Server-side/back-end logic is implemented as Next.js server actions located in the `/actions` directory and the application is deployed on Vercel.

## Project Overview

This repository is a single Next.js application (no separate frontend/backend repos). The frontend and server-side logic live together in the Next.js app; server actions live under `/actions`. Supabase is used as the PostgreSQL database backend. Clerk is used for user authentication and identity management. Vercel is the production deployment platform.

## Key Features

- Next.js (React) frontend with server actions in `/actions`
- Supabase for PostgreSQL data storage and realtime features
- Clerk for authentication and user management
- Deployed to Vercel (production URL above)
- Local development runs only the Next.js frontend/dev server

## Tech Stack

- React
- Next.js
- Supabase (PostgreSQL)
- Clerk
- Vercel

## Getting Started

These instructions assume you only need to run the frontend locally (Next.js dev server). All environment variables and third-party integration details are documented in `/wiki/intergration.md` — consult that file for required keys and configuration.

### Prerequisites

- Node.js (recommended >= 14.x)
- npm, yarn, or pnpm (this project uses npm scripts; using npm is fine)
- An account and project configured in Supabase and Clerk if you want to connect to real services (details in `/wiki/intergration.md`)

### Installation (local development)

1. Clone the repository
```bash
git clone https://github.com/A-shuk/saas.git
cd saas
```

2. Install dependencies
```bash
npm install
# or
# yarn install
# or
# pnpm install
```

3. Configure environment variables

- All required environment variables (API keys, database connection strings, Clerk keys, Supabase URL/anon/service role keys, etc.) are listed in `/wiki/intergration.md`.
- Create a local `.env.local` file populated with the variables described in `/wiki/intergration.md`. Do NOT commit secrets to the repository.

Example (do not use real values — consult `/wiki/intergration.md` for the exact variables and example values):
```text
# .env.local (example)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

4. Start the development server
```bash
npm run dev
# or
# yarn dev
# or
# pnpm dev
```

5. Open the app in your browser
- Default: http://localhost:3000

### Notes about the backend/server actions

- There is no separate backend server process to run locally. Next.js server actions under `/actions` run as part of the Next.js app during local development and when deployed to Vercel.
- The application expects Supabase and Clerk services to be reachable using the credentials in your environment variables. See `/wiki/intergration.md` for how to obtain and configure those.

## Build & Production

To build for production locally:
```bash
npm run build
npm run start
```
This produces the production build and runs the Next.js server locally. In production, the project is deployed to Vercel; the current production URL is:
https://saas-isrvfzgqz-arushs-projects-8c78b9d9.vercel.app

If you want to deploy on Vercel, connect the GitHub repository to your Vercel account and configure environment variables in the Vercel dashboard (see `/wiki/intergration.md` for required keys).

## Ports & Endpoints

- Development (Next.js): http://localhost:3000

Server actions run within the Next.js app; API routes and actions will be reachable under the same host and port during development.

## Environment / Third‑party Integrations

- All environment variables and third-party service integration steps (Supabase, Clerk, etc.) are documented in `/wiki/intergration.md`. Follow that document exactly to obtain API keys, configure callbacks, and set environment variables.
- Do not store real secrets in the repository. Use `.env.local` for local development and your hosting provider's secret management for production.

## Database & Data

- Supabase (PostgreSQL) is used as the database. See `/wiki/intergration.md` for connection strings and any data initialization or migration instructions.
- If you need to seed data or run migrations, follow the Supabase CLI or SQL instructions provided in the integration wiki page.

## Troubleshooting

- If the app fails to start:
  - Confirm Node.js and npm are installed.
  - Confirm dependencies installed successfully (run `npm install` again).
  - Confirm `.env.local` exists and contains the required variables listed in `/wiki/intergration.md`.
  - Confirm Supabase and Clerk keys are valid and the services are reachable.
- If port 3000 is in use, either stop the process using that port or run Next with a different port:
```bash
PORT=3001 npm run dev
```

## Testing & CI

- There are no tests configured for this project.
- CI/deployment is handled via Vercel (connect your GitHub repo and set environment variables in Vercel).

---

