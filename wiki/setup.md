# saas — Companion Builder

This repository is a Next.js + Tailwind + shadcn-based SaaS that lets users create "companions" — persistent assistants that discuss topics or subjects chosen by the user. It uses Clerk for auth & billing, Supabase for persistence, Vapi for LLM streaming, and Sentry for observability.

This docs set covers:
- Project structure & architecture
- Quick setup and environment variables
- Third-party integrations (Clerk, Supabase, Vapi, Sentry)
- Feature guides (Sign-up, Billing, Create Companion)
- Key code walkthroughs (Supabase client, companions.actions.getAllCompanions, middleware)
- Deployment & troubleshooting tips

Recommended docs to read next:
- docs/SETUP.md — Local setup and installs
- docs/INTEGRATIONS.md — Setup steps + code snippets for Clerk, Supabase, Vapi, Sentry
- docs/FEATURES.md — How to create features (Sign-up, Companion creation)
- docs/ARCHITECTURE.md — High-level architecture & data flow

# Local Setup & Installs

Prerequisites
- Node 20 (use nvm if needed: `nvm install 20 && nvm use 20`)
- npm or pnpm
- Git
- A Clerk project, Supabase project, Vapi key, Sentry project

Install base dependencies
```bash
# from repo root
npm install
# UI/animations
npm install tw-animate-css lottie-react
# Supabase
npm install @supabase/supabase-js
# Clerk
npm install @clerk/nextjs
# Vapi
npm install @vapi-ai/web
# Optional utilities used in repo
npm install @jsmastery/utils
```

Tailwind + shadcn setup (already partially documented in repo)
```bash
# tailwind css / animations package (if needed)
npm i tw-animate-css

# initialize shadcn UI (requires Node 20)
npx shadcn@latest init

# add components you want
npx shadcn@latest add button
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add input textarea
npx shadcn@latest add select
npx shadcn@latest add accordion
```

Run locally
```bash
# set env vars (see docs/INTEGRATIONS.md)
cp .env.example .env.local
# ensure node 20
nvm use 20
npm run dev
# open http://localhost:3000
```

Commit links (for reference)
- Clerk sign-in customization: https://github.com/A-shuk/saas/commit/9310c06f0f6e448c3f430fba833c3b6dab327659
- Supabase connection: https://github.com/A-shuk/saas/commit/cb099b3c62ad56a7d4674970eb147eecb3cb8678
- Companions stored & displayed: https://github.com/A-shuk/saas/commit/18238a84924c59a9579f797c9250915245c4bbe5
- Pricing/billing UI integration: https://github.com/A-shuk/saas/commit/229858e46bbc2f6e40cf0aa7e5b4e2f905c8b694