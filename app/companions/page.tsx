import { getAllCompanions } from '@/lib/actions/companion.actions'
import CompanionCard from '@/components/CompanionCard';
import { getSubjectColor } from '@/lib/utils';
import SearchInput from '@/components/Searchinput';
import SubjectFilter from '@/components/SubjectFilter';


/**
 * A page component to display a list of companions based on search parameters.
 * @param {SearchParams} searchParams - The search parameters.
 * @returns {JSX.Element} - A JSX element representing the page.
 */
const CompanionsLibrary = async ({searchParams}: SearchParams) => {
  //fetch companions

  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : '';
  const topic = filters.topic ? filters.topic : '';
  const companions = await getAllCompanions({subject, topic});
  console.log(companions);

  return (
    // display companions on pg
    <main>
      <section className='flex justify-between gap-4 max-sm:flex-col'>
        <h1>Companion Library</h1>
        <div className='flex gap-4'>
          <SearchInput />
          <SubjectFilter />
        </div>

      </section>
      <section className='companions-grid'>
        {/* map over the companions array and render a card for each companion*/}
        {companions.map((companion) => (
          <CompanionCard key={companion.id} {...companion} color = {getSubjectColor(companion.subject)} />
          
        ))}

      </section>
    </main>
  )
}

export default CompanionsLibrary