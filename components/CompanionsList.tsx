// table format copied from shadcn: https://ui.shadcn.com/docs/components/table
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import { cn } from "@/lib/utils"
  import Link from "next/link"
  import Image from "next/image"
  import { getSubjectColor } from "@/lib/utils";

 // interface for CompanionsListProps 
  
interface CompanionsListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}
/**
 * A table component to display a list of companions.
 *
 * @param {CompanionsListProps} props - The component props.
 * @param {string} props.title - The title of the table.
 * @param {string} props.companions - The list of companions to display.
 * @param {string} props.classNames - The className of the table.
 */
const CompanionList = ({title, companions, classNames}: CompanionsListProps) => {
    return (
        <article className={cn('companion-list', classNames)}>
            <h2 className="font-bold text-3xl"> {title} </h2>
            {/*table format copied from shadcn for recent sessions */}
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-lg w2/3">Lessons</TableHead>
                    <TableHead className="text-lg">Subject</TableHead>
                    <TableHead className="text-lg text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/*map over the companions array and render a row for each companion (for lessons table*/}
                    {companions?.map(({id, subject, name, topic, duration}) =>  (
                        <TableRow key = {id}>
                            <TableCell>
                                <Link href = {`/companions/${id}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="size-[72px] flex items-center justify-center rounded-lg max-mid:hidden" style ={{backgroundColor: getSubjectColor(subject)}} >
                                            {/*render the subject icons */}
                                        <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
                                        </div>
                                        {/* render the companion name and topic */}
                                        <div className = "flex flex-col gap 2">
                                            <p className="font-bold text-2xl">{name}</p>
                                            <p className="text-lg">{topic}</p>
                                        </div>
                                    </div>

                                </Link>

                            </TableCell>
                            <TableCell>
                                {/* render subject */}
                                <div className="subject-badge w-fit max-mid:hidden">
                                    {subject}
                                </div>
                                {/* render but on mobile */}
                                <div className="flex items-center justify center rounded-lg w-fit p-2 md:hidden" style = {{backgroundColor: getSubjectColor(subject)}}>
                                    <Image src={`/icons/${subject}.svg`} alt={subject} width={18} height={18} />
                                </div>
                            </TableCell>
                            <TableCell>
                                {/* render duration */}
                                <div className="flex items-center gap-2 w-full justify-end">
                                    <p className="text-2xl">{duration} {' '}
                                        <span className="max-md:hidden">mins</span>
                                    </p>
                                    {/* render clock icon on mobile */}
                                    <Image src = "/icons/clock.svg" alt = "minutes" width = {14} height = {14} className="md:hidden"/>

                                </div>

                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>
                </Table>
                            

        </article>
    )
}

export default CompanionList