"use client" //browser side (form submission, keyboard events) 
import {z} from "zod" // validate inputs
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { subjects } from "@/constants"
import { Textarea } from "@/components/ui/textarea"


// copied from shadcn: https://ui.shadcn.com/docs/forms/react-hook-form

// validate inputs
const formSchema = z.object({
    name: z.string().min(1, { message: 'Companion is required.' }),
    subject: z.string().min(1, { message: 'Subject is required.' }),
    topic: z.string().min(1, { message: 'Topic is required.' }),
    voice: z.string().min(1, { message: 'Voice is required.' }),
    style: z.string().min(1, { message: 'Style is required.' }),
    duration: z.number().min(1, { message: 'Duration is required.' }),
});

const CompanionForm = () => {
    // define form
     const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        //set default values for form
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            voice: '',
            style: '',
            duration: 15,

        },
    })
    //submit form
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        //render form for example it shows the name field
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/*can duplicate form field from line 55-67 */}
                {/*form field for name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Companion Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter companion name" {...field} className="input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*form field for subject */}
                 <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                {/*select copied from shadcn https://ui.shadcn.com/docs/components/select */}
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                >
                            <SelectTrigger className="input capitalize">
                                <SelectValue placeholder="Select the Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {/*map over subjects array and render each subject as a SelectItem */}
                                {subjects.map((subject) => (
                                <SelectItem value={subject} key={subject} className="capitalize">
                                    {subject}
                                </SelectItem>
                                ))}
                                
                            </SelectContent>
                            </Select>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*form field for topic */}
                 <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Ex Integerals" {...field} className="input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 {/*form field for voice */}
                 <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Voices</FormLabel>
                            <FormControl>
                                {/*select copied from shadcn https://ui.shadcn.com/docs/components/select */}
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                >
                            <SelectTrigger className="input">
                                <SelectValue placeholder="Select the Voice" />
                            </SelectTrigger>
                            <SelectContent>
                               
                                <SelectItem value="male" >
                                    Male
                                </SelectItem>

                                <SelectItem value="female" >
                                    Female
                                </SelectItem>
                               
                                
                            </SelectContent>
                            </Select>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*form field for voice style*/}
                <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Voice Style</FormLabel>
                            <FormControl>
                                {/*select copied from shadcn https://ui.shadcn.com/docs/components/select */}
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                                >
                            <SelectTrigger className="input">
                                <SelectValue placeholder="Select the style" />
                            </SelectTrigger>
                            <SelectContent>
                               
                                <SelectItem value="formal" >
                                    Formal
                                </SelectItem>

                                <SelectItem value="casual" >
                                    Casual
                                </SelectItem>
                               
                                
                            </SelectContent>
                            </Select>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*form field for duration*/}
                 <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estimated session duration in minutes</FormLabel>
                            <FormControl>
                                <Input type = "number" placeholder="15 minutes" {...field} className="input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 
                <Button type="submit" className="w-full cursor-pointer">Submit Companion</Button>
            </form>
        </Form>
    )
}

export default CompanionForm