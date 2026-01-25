//copied from https://ui.shadcn.com/docs/components/radix/accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserCompanions } from "@/lib/actions/companion.actions";
import { getUserSessions } from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionList from "@/components/CompanionsList";

const Profile = async () => {
  //fetch user details
  const user = await currentUser();
  //if not signed in, redirect to sign in
  if(!user) {
    redirect('/sign-in');
  }

  //fetch all companions
  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          {/*user avatar*/}
        <Image src = {user.imageUrl} alt = {user.firstName!} width = {110} height = {110} />
        <div className="flex flex-col gap-2">
          {/*user name*/}
          <h1 className="font-bold text-2xl">{user.firstName} {user.lastName}

          </h1>
          <p className="text-sm text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
          
        </div>


        </div>
        <div className="flex gap-4">
          <div className="border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src = "/icons/check.svg" alt = "checkmark" width = {22} height = {22} />  
              <p className="text-2xl font-bold"> {sessionHistory.length} 

              </p>

            </div>
            <div>Lessons Completed</div>


          </div>
          <div className="border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src = "/icons/cap.svg" alt = "cap" width = {22} height = {22} />  
              <p className="text-2xl font-bold"> {companions.length} 

              </p>

            </div>
            <div>Companions Created</div>


          </div>
          


        </div>


      </section>
      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
          <AccordionContent>
            <CompanionList title="Recent Sessions" companions={sessionHistory}/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">My Companions {`(${companions.length})`}</AccordionTrigger>
          <AccordionContent>
          <CompanionList title="My Companions" companions={companions}/>

          </AccordionContent>
        </AccordionItem> 
      </Accordion>
    </main>
  )
}

export default Profile