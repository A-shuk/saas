'use client' //whenever u use a use..() it is a client side component like in line 6

import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { useEffect } from "react"
import { formUrlQuery } from "@jsmastery/utils"
import { removeKeysFromUrlQuery } from "@jsmastery/utils"


/**
 * A functional component that renders a search bar.
 * The search bar is composed of a search icon and an input field.
 * When the user types in the input field, the component navigates to the search page with the search query as a parameter.
 * The component uses the usePathname, useRouter, and useSearchParams hooks from next/navigation to get the current pathname, navigate to different pages, and get the search parameters of the current page, respectively.
 * The component also uses the useState hook to store the search query and the useEffect hook to do the db search when the user is typing.
 */
const SearchInput = () => {
    //get the current pathname where pathname is the path of the current page
    const pathname = usePathname(); 
    const router = useRouter(); //used to navigate to different pages
    const searchParams = useSearchParams(); //used to get the search parameters of the current page

    const query = searchParams.get('topic') || ''; //get the value of the topic parameter
    const [searchQuery, setSearchQuery] = useState(''); //state variable to store the search query
    //do db search when user is typing

    useEffect(() => {
        //add a delay or bounce to query (so  only 1 request is sent, not per keystroke)
        //delay is 500ms (when user stops typing, the query is sent)
        const delayBounceFn = setTimeout(() => {
            if (searchQuery) {
                //if searchQuery is not empty, navigate to the search page with the search query as a parameter
                const newUrl = formUrlQuery({
                    //add the search query to the url
                    params: searchParams.toString(),
                    key: "topic",
                    value: searchQuery,
                });
                router.push(newUrl, {scroll: false});
            } 
            
            else {
                if(pathname === '/companions') {
                    //if searchQuery is empty, remove the topic parameter from the url
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['topic'],
                    });
                    router.push(newUrl, {scroll: false});
                    
                }
            }

            
        }, 500);

        
    }, [searchQuery, router, searchParams, pathname]);
   

    return (
        //search bar img
        <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
            <Image src = "/icons/search.svg" alt = "search" width = {15} height = {15} />

            {/* search bar input*/}
            {/* input element with placeholder text and value of searchQuery and onChange event handler to update searchQuery state variable */}
            <input placeholder = "Search Companions.." className="outline-none" value = {searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
    

    )
}

export default SearchInput