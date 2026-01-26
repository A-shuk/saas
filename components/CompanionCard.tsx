'use client'

import { addBookmark, removeBoookmark } from "@/lib/actions/companion.actions"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
// interface for CompanionCardProps on dashboard pg

interface CompanionCardProps {
    id: string
    name: string
    topic: string
    subject: string
    duration: number
    color: string
    bookmarked: boolean
}

/**
 * A card component representing a companion.
 *
 * @param {CompanionCardProps} props - The component props.
 * @param {string} props.id - The ID of the companion.
 * @param {string} props.name - The name of the companion.
 * @param {string} props.topic - The topic of the companion.
 * @param {string} props.subject - The subject of the companion.
 * @param {number} props.duration - The duration of the companion.
 * @param {string} props.color - The color of the companion.
 * @param {boolean} props.bookmarked - Whether the companion is bookmarked.
 */
const CompanionCard = ({id, name, topic, subject, duration, color, bookmarked}: CompanionCardProps) => {
    const pathname = usePathname();

    /**
     * Handles bookmarking/unbookmarking a companion.
     * If the companion is currently bookmarked, it removes the bookmark.
     * If the companion is not currently bookmarked, it adds a bookmark.
     * @returns {Promise<void>} A promise that resolves when the bookmark is added or removed.
     */
    const handleBookmark = async() => {
        if(bookmarked) {
            await removeBoookmark(id, pathname); //remove bookmark
        } else {
            await addBookmark(id, pathname); //add bookmark
        }
    };


    //ui of the card (colour and style) through article
    return (
        <article className="companion-card" style = {{backgroundColor: color}}>
            {/* pass in card content (subject, bookmark icon) through div*/}
            <div className="flex justify-between items-center">
                <div className="subject-badge">{subject}</div>
                {/* pass in bookmark icon through button*/}
                <button className="companion-bookmark" onClick={handleBookmark}>
                    <Image src = {bookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"} alt = "bookmark" width = {12.5} height = {15} />
                    
                </button>

             </div>
             {/* pass in card content (name, topic, duration) through div*/}
             <h2 className="text-2xl font-bold">{name}</h2>
             <p className="text-sm">{topic}</p>
             <div className="flex items-center gap-2">
                <img src = "/icons/clock.svg" alt = "clock" width = {13.5} height = {13.5} />
                <p className="text-sm">{duration} minutes </p>
             </div>
             {/* pass in launch lesson button through link*/}
             <Link href = {`/companions/${id}`} className = "w-full">
                <button className="btn-primary w-full justify-center">Launch Lesson</button>
                
             </Link>
        </article>
        
    )
}

export default CompanionCard