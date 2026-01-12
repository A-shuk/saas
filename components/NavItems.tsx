'use client' //rendered on the client side
import Link from "next/link"
import {usePathname} from "next/navigation"
import path from "path"
import {cn} from "@/lib/utils"
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
    //figure out which page we are on
    const pathname = usePathname();
    return (
        <nav className="flex items-center gap-4">
            {/* map over the navItems array and render a link for each item */}
            {navItems.map(({label, href}) => (
                //make the current page bold in navbar
                <Link href ={href} key={label} className = {cn(pathname === href && 'text-primary font-semibold')}>
                    {label}
                </Link>
            ))}
        </nav>
    )
}
export default NavItems