import Link from "next/link"
// store the navigation items in an array
const navItems = [
    {label: 'Home', href: '/'},
    {label: 'Companions', href: '/companions'},
    {label: 'My Journey', href: '/my-journey'},

]
/**
 * A component that renders a navigation bar with links to different pages.
 *
 * It uses the `navItems` array to generate the links.
 *
 * @returns {JSX.Element} A navigation bar with links.
 */
const NavItems = () => {
    return (
        <nav className="flex items-center gap-4">
            {/* map over the navItems array and render a link for each item */}
            {navItems.map(({label, href}) => (
                <Link href ={href} key={label}>
                    {label}
                </Link>
            ))}
        </nav>
    )
}
export default NavItems