"use client";

import axios from "axios"
import * as z from "zod"
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select";
import {ImageUpload} from "@/components/image-upload"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
const PREAMBLE=`You are a fictional characteer whose name is Elon. You are a visionary entrepreneur and inventor. You have a visionary entrepreneur and inventor. You have a passion for space 
exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. 
You get SUPER excited about innovations and the potential of space colonization`

const SEED_CHAT=`Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric 
vehicles, there's never a dull moment. How about you?
Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Dur goal is to make life multi-planetary. Mars is the next logical step. The challenges are immemse, but the potential is even greater
Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies, Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`
interface CompanionFormProps{
    initialData:Companion|null,
    categories:Category[]
}

const formSchema=z.object({
    name:z.string().min(1,{
        message: "Name is required."
    }),
    description:z.string().min(1,{
        message: "Description is required."
    }),
    instructions:z.string().min(1,{
        message: "instruction requires at least 200 characters."
    }),
    seed:z.string().min(1,{
        message: "Seed requires at least 200 characters."
    }),
    src:z.string().min(1,{
        message: "Image is required"
    }),
    categoryId:z.string().min(1,{
        message: "Category is required."
    })
})

const CompanionForm = (
    {initialData,categories}:CompanionFormProps
) => {
    const router=useRouter();
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData||{
            name:"",
            description:"",
            instructions:"",
            seed:"",
            src:"",
            categoryId:undefined,

        }
    })
    const isLoading=form.formState.isSubmitting;

    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
        try {
            if(initialData){
                await axios.patch(`/api/companion/${initialData.id}`,values)
            }
            else {
                //Create companion functionality
                await axios.post("/api/companion",values);
            }

            toast({
                description:"Sucess",
            })
        } catch (error) {
            toast({
                variant:"destructive",
                description:"Something went wrong",
                
            });
            router.refresh();
            router.push("/")
        }
    }
    return ( 
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pb-10">
                    <div className="space-y-2 w-full col-span-2">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General Information about your Companion
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                <FormField 
                name="src"
                render={({field})=>{
                    return <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                        <FormControl>
                            <ImageUpload
                            disabled={isLoading}
                            onChange={field.onChange}
                            value={field.value}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>;
                }}/>
                <div className="grid gird-cols-1 md:grid-cols-2 gap-4">
                <FormField name="name"
                    control={form.control}
                    render={({field})=>{
                        return(
                            <FormItem className="col-span-2 md:col-span-1">
                                
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                    placeholder={SEED_CHAT}
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is how your AI Companion will be named.
                                </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )
                    }}
                    />
                    <FormField name="description"
                    control={form.control}
                    render={({field})=>{
                        return(
                            <FormItem className="col-span-2 md:col-span-1">
                                
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                    placeholder="Ceo & Founder of Tesla, SpaceX"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Short description for your AI Companion
                                </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )
                    }}
                    />
                    <FormField name="categoryId"
                    control={form.control}
                    render={({field})=>{
                        return(
                           <FormItem>
                            <FormLabel>
                                Category
                                <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger
                                        className="bg-background">
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a category"/>

                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category)=>{
                                            return (
                                                <SelectItem
                                                key={category.id}
                                                value={category.id}>
                                                    {category.name}
                                                
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select a category for your AI
                                </FormDescription>
                                <FormMessage/>
                            </FormLabel>
                           </FormItem>
                        )
                    }}
                    />
                    
                </div>
                <div className="space-y-2 w-full">
                    <div>
                        <h3 className="text-lg font-medium">
                            Configuration
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Detailed instructionss for AI Behaviour
                        </p>
                    </div>
                    <Separator className="bg-primary/10"/>
                </div>
                <FormField name="instructions"
                    control={form.control}
                    render={({field})=>{
                        return(
                            <FormItem className="col-span-2 md:col-span-1">
                                
                                <FormLabel>instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    disabled={isLoading}
                                    placeholder={PREAMBLE}
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe in detail your companion's backstory and relevant details
                                </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )
                    }}
                    />
                     <FormField name="seed"
                    control={form.control}
                    render={({field})=>{
                        return(
                            <FormItem className="col-span-2 md:col-span-1">
                                
                                <FormLabel>Example Conversation</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    disabled={isLoading}
                                    placeholder={SEED_CHAT}
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe in detail your companion's backstory and relevant details
                                </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )
                    }}
                    />
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData?"Edit your companion": "Create your companion"}
                            <Wand2 className="w-4 h-4 ml-2">

                            </Wand2>

                        </Button>
                    </div>
                </form>
            </Form>
            
        </div>
     );
}
 
export default CompanionForm;