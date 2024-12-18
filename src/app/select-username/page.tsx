"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { hasUsername, isUsernameReserved, reserveUsername } from "@/lib/firebase/usernameService";
import { zodResolver } from "@hookform/resolvers/zod";

const selectUsernameFormSchema = z.object({
  username: z
  .string()
  .min(4, { message: "Username must be at least 4 characters long" })
  .max(20, { message: "Username must not exceed 20 characters" })
  .superRefine(async (username, ctx) => {
    if (username.length < 4 || username.length > 20) return;

    const usernameReserved = await isUsernameReserved(username);
    if (usernameReserved) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Username ${username} is already taken`,
      });
    }
  })
})

const SelectUsername = () => {

  const router = useRouter()
  const { currentUser, forceUpdate } = useAuth()

  useEffect(() => {
    const protectUsernameRoute = async () => {
      if (!currentUser) {
        router.push("/sign-in")
        return
      }

      const hasUsernameField = await hasUsername(currentUser.uid)
      hasUsernameField ? router.push("/") : null
    }

    protectUsernameRoute()
  }, [router])

  const selectUsernameForm = useForm<z.infer<typeof selectUsernameFormSchema>>({
    resolver: zodResolver(selectUsernameFormSchema),
    defaultValues: {
      username: "",
    }
  })

  const handleSelectUsername = async (values: z.infer<typeof selectUsernameFormSchema>) => {
    if (!currentUser?.uid) {
      console.error("User is not authenticated.");
      return;
    }  
    try {
      await reserveUsername(values.username, currentUser.uid)
      forceUpdate()
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-grow justify-center items-center h-screen">
      <Card className="flex flex-col w-[420px]">
        <CardHeader>
          <CardTitle>Select Username</CardTitle>
          <CardDescription>Choose a unique name to represent your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...selectUsernameForm}>
            <form onSubmit={selectUsernameForm.handleSubmit(handleSelectUsername)} className="space-y-8">
              <FormField
                control={selectUsernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Select Username</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SelectUsername
