import CompanionForm from "@/components/CompanionForm"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const NewCompanion = async () => {
  // check if user is signed in to build companion, otherwise redirect to sign in
  const {userId} = await auth();
  // if user not signed in, redirect to sign in
  if (!userId) {
    redirect('/sign-in');
    
  }
  return (
    <main className="min-lg: w-1/3 min-md: w-2/3 items center justify center">
      <article className="w-full gap-4 flex flex-col">
        <h1> Companion Builder</h1>
        <CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanion