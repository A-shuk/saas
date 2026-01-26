# Architecture & Data Flow

Overview
- Frontend: Next.js (App Router), Tailwind CSS, shadcn components
- Auth & Billing: Clerk (handles authentication, sessions, and billing features)
- Database: Supabase Postgres (companions, session_history, users)
- LLM/Streaming API: Vapi for assistant responses & streaming audio
- Observability: Sentry
- Storage & Media: (if applicable — configured in project as needed)

Primary flows
1. User signs up / signs in via Clerk (Clerk session available in frontend & server).
2. User creates a "companion" via UI — companion metadata is saved to Supabase companions table.
3. When the user starts chatting with a companion:
   - A new session entry is recorded in `session_history` in Supabase.
   - App sends prompts to Vapi (or configured model) and streams or fetches responses.
   - Responses can be stored in session history for auditing & replay.
4. Billing: Configure plans & features in Clerk. Server-side checks to unlock premium capabilities.

Key files (search the repo for these names)
- supabase/supabaseClient.ts — Supabase client initialization
- app/layout.tsx — wrap app with ClerkProvider & global providers
- middleware.ts — Clerk middleware for route protection
- app/(protected)/components/CompanionsLibrary.tsx — library UI
- app/(protected)/components/CompanionCard.tsx — companion card UI
- lib/companions.actions.ts — business logic around fetching/creating companions
- app/(protected)/[companion]/page.tsx — companion chat page
- sentry config via `@sentry/nextjs` (if present)

Data tables (recommended)
- companions
  - id: uuid (PK)
  - name: varchar
  - duration: int8
  - voice : varchar
  - style: varchar
  - topic: varchar
  - subject: varchar
  - author: varchar
  - created_at, updated_at


  
- session_history
  - id: uuid
  - companion_id: uuid
  - user_id: varchar
  - created_at

- bookmarks
  - user_id: varchar
  - companion_id: uuid

Foreign Keys:
- Bookmarks: companion_id -> public.companions.id (CASCADE FOR ALL)
- session_history: companion_id -> public.companions.id (CASCADE FOR ALL)

Security & policies
- Use Row Level Security (RLS) on Supabase tables:
  - companions: allow select/insert/update for owner `user_id = auth.uid()`
  - session_history: same pattern
  Create 2 RLS policies for each table:
  All:
  alter policy "All"


on "public"."companions"


to anon


using (

7
  true

);
Use select, anon, 

Clerk:
alter policy "Clerk"


on "public"."companions"


to authenticated

using (

  (( SELECT auth.jwt() AS jwt) IS NOT NULL)

) with check (

 (( SELECT auth.jwt() AS jwt) IS NOT NULL)

);
Authenticated, all

```

Notes
- Keep secrets out of the repo — use `.env.local` and CI secrets for deployments.
- For Vercel deployments, add env vars in the Project Settings.