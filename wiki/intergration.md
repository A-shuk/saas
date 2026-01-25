# Integrations Reference

This file provides step-by-step setup and code snippets for Clerk, Supabase, Vapi, and Sentry used in this project.

Environment variables (examples)
- Clerk
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  - CLERK_SECRET_KEY=sk_test_...
- Supabase
  - NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
  - SUPABASE_SERVICE_ROLE_KEY=service-role-key (use only on server)
- Vapi
  - VAPI_API_KEY=sk-...
- Sentry
  - SENTRY_DSN=https://...

Clerk (Auth + Billing)
1. Install:
```bash
npm install @clerk/nextjs
```
2. Add env vars to `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_....
CLERK_SECRET_KEY=sk_test_......
```
3. Middleware (protect routes & forward session):
Create `middleware.ts` at repo root:
```ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|static|.*\\..*).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```
4. Wrap app with ClerkProvider — `app/layout.tsx`:
```tsx
import { ClerkProvider } from '@clerk/nextjs/app-beta'; // or '@clerk/nextjs' depending on version
import type { PropsWithChildren } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
```
5. Add sign-in / user buttons in Navbar:
```tsx
import { SignInButton, UserButton } from '@clerk/nextjs';

function Navbar() {
  return (
    <nav>
      <SignInButton>
        <button>Sign in</button>
      </SignInButton>
      <UserButton /> {/* shows user avatar when signed in */}
    </nav>
  );
}
```
6. Billing & Plans
- Configure plans in Clerk dashboard (Billing → Plans). Create free / paid plans and define features.
- In UI, use Clerk billing widgets or integrate server-side checks that read the user's subscription via Clerk API to gate features.

Custom Sign-in flow
- Follow Clerk docs for a custom combined sign-in/sign-up page:
  - https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page

Supabase (DB)
1. Create project in Supabase
2. Create the `companions` and `session_history` tables via Table Editor with columns described in docs/ARCHITECTURE.md
3. Setup Row Level Security (RLS) policies:
- companions: allow access to owner only
- session_history: owner only

4. Fetch Supabase keys for Next.js
- Project → Settings → API → `anon` keys & URL
- Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key # server-only, not for frontend
```

5. Initialize client (example: `lib/supabaseClient.ts`)
```ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);
```

6. Example fetch — `lib/companions.actions.ts`
```ts
import { supabase } from './supabaseClient';

export async function getAllCompanions(userId: string) {
  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

Vapi (LLM / streaming)
1. Create a public key in Vapi dashboard.
2. Install client:
```bash
npm install @vapi-ai/web
```
3. Example usage (client-side streaming / web sdk):
```ts
import { VapiClient } from '@vapi-ai/web';

const client = new VapiClient({ apiKey: process.env.VAPI_API_KEY });

async function askVapi(prompt: string) {
  const response = await client.chat.create({
    model: 'gpt-4o-mini', // example
    input: prompt,
    // streaming and other options per Vapi docs
  });
  return response;
}
```
4. Sound wave & animation: install `lottie-react` for visualisations:
```bash
npm install lottie-react
```

Sentry (Error Tracking)
1. Create a Sentry project and copy DSN to `.env.local`:
```
SENTRY_DSN=https://....
```
2. Install and run the Sentry wizard for Next.js:
```bash
npx @sentry/wizard@latest -i nextjs --saas --org <org> --project <project>
```
3. Follow the wizard choices (Tracing recommended). Re-run dev and visit `http://localhost:3000/sentry-example-page` to verify.

Notes & links
- Commit references with integrations exist in this repo:
  - Clerk middleware & custom sign-in: https://github.com/A-shuk/saas/commit/9310c06f0f6e448c3f430fba833c3b6dab327659
  - Supabase connection: https://github.com/A-shuk/saas/commit/cb099b3c62ad56a7d4674970eb147eecb3cb8678
  - Companions creation: https://github.com/A-shuk/saas/commit/18238a84924c59a9579f797c9250915245c4bbe5
  - Pricing / billing UI: https://github.com/A-shuk/saas/commit/229858e46bbc2f6e40cf0aa7e5b4e2f905c8b694