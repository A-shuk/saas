import Image from "next/image"
import Link from "next/link"

/**
 * A Call-To-Action (CTA) component that prompts users to build and personalize a learning companion.
 *
 * It displays a badge, a heading, a paragraph, an image and a button with a link to create a new companion.
 *
 * @returns {JSX.Element} A JSX element representing the CTA component.
 */
const Cta = () => {
    return (
        // cta section 
        <section className="cta-section">
            <div className="cta-badge">Start learning your way</div>
            <h2 className="text-3xl font-bold">Build and Personalise Learning Compnanion</h2>
            <p className="text-lg">Pick a name, topic and subject to get started</p>
            <Image src = "/images/cta.svg" alt = "cta" width = {362} height = {232} />
            <button className="btn-primary">
                <Image src = "/icons/plus.svg" alt = "plus" width = {12} height = {12} />
                <Link href = "/companions/new">
                    <p>Create Companion</p>
                </Link>
            </button>
        </section>
    )
}

export default Cta