
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server';
/**
 * Creates a Supabase client instance with the given URL and anonymous key.
 * The instance is configured to use the `accessToken` function to obtain an access token,
 * which is obtained by calling `getToken()` on the Clerk authentication object.
 * @returns {SupabaseClient} A Supabase client instance.
 */
export const createSupabaseClient = () => {
    //! shows that those keys are there
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY! , {
/**
 * Returns an access token for the Supabase client.
 * This token is obtained by calling `getToken()` on the Clerk
 * authentication object.
 * @returns {Promise<string>} A promise that resolves with an access token.
 */
            async accessToken() {
                return ((await auth()).getToken());
            }
        }

    )
}