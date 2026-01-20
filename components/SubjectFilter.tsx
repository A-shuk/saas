"use client";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";



/**
 * A functional component that renders a dropdown select for subjects.
 * The select is populated with the subjects from the subjects constant.
 * When the user selects a subject, the component navigates to the current page with the selected subject as a parameter.
 * If the user selects "all", the component removes the subject parameter from the url.
 */
const SubjectFilter = () => {
    //same as search input.tsx

    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("subject") || "";

    const [subject, setSubject] = useState(query);

    useEffect(() => {
        let newUrl = "";
        if (subject === "all") {
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["subject"],
            });
        } else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });
        }
        router.push(newUrl, { scroll: false });
    }, [subject]);

    
    return (
        //render select
        <Select onValueChange ={setSubject} value={subject}>
            <SelectTrigger className = "input capitalize">
                <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value = "all">All subjects</SelectItem>
                {/* map over the subjects array and render a select item for each subject*/}
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="capitalize">
                        {subject}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

};

export default SubjectFilter