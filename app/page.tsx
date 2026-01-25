import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions } from '@/lib/actions/companion.actions'
import React from 'react'
import { getRecentSessions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'

/**
 * Page component for the home page.
 * Fetches the recent companion sessions and renders them with the CompanionCard component.
 * Also renders a CTA component.
 */
const Page = async () => {
  //fetch recent  companion sessions
  const companions = await getAllCompanions({limit: 3});
  const recentSessions = await getRecentSessions(10);
  return (
    <main>
      <h1 className='text-2xl'>Popular Companions</h1>
      <section className='home-section'>
        {/* map over the companions array and render a card for each companion*/}
        {companions.map((companion) => (
            <CompanionCard
            {...companion}
            key = {companion.id}
            color = {getSubjectColor(companion.subject)}
            
            />

          
        ))}
       
      
      </section>
      <section className = "home-section">
        <CompanionList
        title = "Recently completed sessions"
        companions = {recentSessions}
        classNames = "w-2/3 mas-lg:w-full"
        
        />
        <CTA/>
      </section>
      
    </main>
  )
}

export default Page