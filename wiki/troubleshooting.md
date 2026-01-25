# Troubleshooting & Tips

Common issues & fixes

1) "Clerk not authenticating or middleware not triggering"
- Ensure `middleware.ts` is at the repository root.
- Ensure env vars are set and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is present.
- Confirm `matcher` configs in `middleware.ts` are correct for your routes.

2) "Supabase permissions (403) or empty results"
- Confirm RLS policies allow the operation for `auth.uid()`.
- For server operations needing elevated privileges, use `SUPABASE_SERVICE_ROLE_KEY` on the server only.
- Confirm you use the correct `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3) "Vapi streaming issues"
- Ensure Vapi public key is valid and not exposed in places you don't want.
- For server usage, use server-side API key patterns from Vapi docs.
- Test with a simple non-streaming request to ensure credentials are valid.

4) "Sentry not reporting"
- Check SENTRY_DSN is set.
- Confirm the Sentry wizard completed and Sentry SDK is initialized in project.
- Visit `/sentry-example-page` for a test.

Debugging tips
- Add logging around server API calls.
- Use Supabase SQL Editor to view table rows and policy logs.
- Use Clerk Dashboard to inspect user objects and subscriptions.

