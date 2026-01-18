import {PricingTable} from "@clerk/nextjs";
//add subcription

/**
 * Subscription component to display pricing information
 */
const Subscription = () => {
  // dispay subscription plans
  return (
    <div>
      <PricingTable />
    </div>
  )
}

export default Subscription