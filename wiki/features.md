# Feature Guides

This file describes how to implement common features in the repo: Sign-up, Billing, Companion creation & display, Search redirect.

1) Creating Sign-up & Sign-in feature (Clerk)
--------------------------------------------
Goal: A single flow where users can sign in or sign up.

Steps:
- Ensure Clerk is installed and env vars are set (see docs/INTEGRATIONS.md).
- Create a custom combined sign-in/sign-up page (Clerk docs sample).
- Use `<SignIn />` and `<SignUp />` components or the Combined approach.

Example: simple sign-in button (in `components/Navbar.tsx`):
```tsx
import { SignInButton } from '@clerk/nextjs';
function Navbar() {
  return (
    <nav>
      <SignInButton>
        <button className="btn">Sign in</button>
      </SignInButton>
    </nav>
  );
}
```

Custom combined page (simplified):
```tsx
// app/signin/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />;
}
```

2) Billing / Plans (Clerk)
---------------------------
- Create Plans in Clerk dashboard (free vs paid).
- Add Features to plans in Clerk Billing screen to toggle premium features.
- In the app, check user subscriptions via Clerk server APIs to gate features.

Example server-side check (pseudo):
```ts
import Clerk from '@clerk/clerk-sdk-node';

const clerkClient = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

async function userHasPlan(userId: string, planId: string) {
  const subs = await clerkClient.subscriptions.getSubscriptionForUser(userId);
  // check planId or features in subs
}
```

3) Create Companion feature (Supabase)
-------------------------------------
Goal: Allow signed-in users to create a companion and have it saved to Supabase.

UI:
- A create form (name, description, settings)
- On submit, call a server action/api route that writes to `companions` table.

Client -> API route (example using fetch):
```ts
// app/(protected)/create-companion/form.tsx (client-side)
async function handleSubmit(formData) {
  const res = await fetch('/api/companions', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

API route (server-side) — `pages/api/companions.ts` or `app/api/companions/route.ts`:
```ts
import { supabase } from '@/lib/supabaseClient';
import { auth } from '@clerk/nextjs'; // or server helpers

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = auth(); // get clerk user id in server component
  const { data, error } = await supabase.from('companions').insert([
    {
      user_id: userId,
      name: body.name,
      description: body.description,
      settings: body.settings,
    },
  ]);

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 201 });
}
```

Companions library & display
- `lib/companions.actions.ts` (or similar) exposes `getAllCompanions`.
- `CompanionsLibrary` (React Server Component) calls `getAllCompanions` and passes results to `CompanionCard`.

Example getAllCompanions (reiterated):
```ts
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

4) Session History (store chat)
-------------------------------
- When a chat session happens, write entries to `session_history`.
- Provide a page to view history per companion.

Example insert:
```ts
await supabase.from('session_history').insert([
  {
    companion_id,
    user_id,
    input: userMessage,
    response: assistantResponse,
  },
]);
```

5) Search redirect (when user types)
------------------------------------
- The repo uses `@jsmastery/utils` for search redirect.
- Example: call a helper that redirects to `/search?q=...` when user enters a term.

6) Using Vapi for responses & audio waves
-----------------------------------------
- Install `@vapi-ai/web` and `lottie-react`.
- Use Vapi client to stream chat responses and update UI in real-time.
- Use Lottie to show sound-wave animations while streaming.

Example (high level):
```tsx
import { VapiClient } from '@vapi-ai/web';
import Lottie from 'lottie-react';

const client = new VapiClient({ apiKey: process.env.VAPI_API_KEY });

async function sendToAssistant(prompt) {
  const stream = await client.chat.stream({
    model: 'gpt-4o-mini',
    input: prompt,
  });
  for await (const chunk of stream) {
    // append chunk to UI stream buffer
  }
}
```

General recommendations
- Validate user permissions server-side (do not rely on client).
- Use Supabase RLS together with Clerk to ensure only owners can read/write companions / sessions.
- Add monitoring (Sentry) on API and server pages to capture errors and traces.