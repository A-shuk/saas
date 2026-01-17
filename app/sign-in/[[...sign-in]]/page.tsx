import { SignIn } from '@clerk/nextjs'
//copied from clerk: https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page


/**
 * Page component that renders a sign in component centered in the page.
 */
export default function Page() {
    // sign in component center of pg
  return <main className='flex items-center justify-center'>
    <SignIn /> </main>
}