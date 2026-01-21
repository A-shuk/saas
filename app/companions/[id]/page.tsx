import { getCompanion } from '@/lib/actions/companion.actions';
import { currentUser } from '@clerk/nextjs/server';
import {redirect} from "next/navigation"
import { getSubjectColor } from '@/lib/utils';
import Image from 'next/image';
interface CompanionSessionPageProps {
  params: {id: string};
   
  }

  //search params /url?key=value&key1=value1
  //params /url/{id} -> id
const CompanionSession = async ({params}: CompanionSessionPageProps) => {

  const {id} = await params; //get id from params
  const user = await currentUser(); //get user
  const companion = await getCompanion(id); //get companion
  
  //if user not signed in, redirect to sign in
  if(!user) {
    redirect('/sign-in');
  }
  //if companion not found, redirect to companions
  if(!companion) {
    redirect('/companions');
  }
  console.log(companion);
  const {name, subject, title, topic, duration} = companion //get companion

  return (
    <main>
      <article className='flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className='flex items-center gap-2'>
          <div className='size-[72px] flex items-center jusitify-center rounded-lg max-md:hidden' style = {{backgroundColor: getSubjectColor(subject)}}>
            <Image src = {`/icons/${subject}.svg`} alt = {subject} width = {35} height = {35} />

          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <p className='font-bold text-2xl'>{name}</p>
              <div className='subject-badge max-sm:hidden'>
                {subject}

              </div>


            </div>

            <p className='text-lg'>{topic}</p>

          </div>


        </div>
        <div className='items-start text 2xl max-md:hidden'> 
          {duration} minutes
        </div>

      </article>

    </main>
  )
}

export default CompanionSession