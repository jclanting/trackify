"use client"
import { useRouter } from "next/navigation";
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
import { signInWithEmail, signInWithGoogle, signInWithUsername } from "@/lib/firebase/auth";
import { hasUsername } from "@/lib/firebase/usernameService";
import { zodResolver } from "@hookform/resolvers/zod";

const signInFormSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, { message: "Please enter a valid username or email" })
    .refine((val) => z.string().email().safeParse(val).success || val.length >= 4, {
      message: "Please enter a valid username or email",
    }),
  password: z
    .string().min(1, { message: "Please enter a valid password"})
})

const SignIn = () => {

  const router = useRouter()
  const { updateUser, currentUser } = useAuth()
  
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: ""
    }
  })

  const handleSignIn = async (values: z.infer<typeof signInFormSchema>) => {

    const isEmail = z.string().email().safeParse(values.usernameOrEmail).success

    if (isEmail) {
      try {
        const userCredential = await signInWithEmail(values.usernameOrEmail, values.password, updateUser)
        if (userCredential.user) {
          const hasUsernameField = await hasUsername(userCredential.user.uid)
          hasUsernameField ? router.push("/") : router.push("select-username")
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const userCredential = await signInWithUsername(values.usernameOrEmail, values.password, updateUser)
        if (userCredential.user) {
          const hasUsernameField = await hasUsername(userCredential.user.uid)
          hasUsernameField ? router.push("/") : router.push("select-username")
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle(updateUser)
      if (userCredential.user) {
        const hasUsernameField = await hasUsername(userCredential.user.uid)
        hasUsernameField ? router.push("/") : router.push("select-username")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-grow justify-center items-center h-screen">
      <Card className="flex flex-col w-[420px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to your account to document artist tracklists.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-8">
              <FormField
                control={signInForm.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Username or Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </Form>
          
          <div className="flex justify-center text-sm text-slate-500 my-4">
            Don't have an account?&nbsp;
            <span className="font-semibold underline underline-offset-4 cursor-pointer" onClick={() => router.push("/sign-up")}>Sign Up</span>
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-slate-200" />
            <span className="mx-4 text-sm">or</span>
            <hr className="flex-grow border-t border-slate-200" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" transform="translate(0.845947)" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M23.8859 12.2614C23.8859 11.4459 23.8128 10.6618 23.6769 9.90912H12.8459V14.3575H19.035C18.7684 15.795 17.9582 17.013 16.7403 17.8284V20.7139H20.4569C22.6314 18.7118 23.8859 15.7637 23.8859 12.2614Z" fill="#4285F4"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.8459 23.4998C15.9509 23.4998 18.5541 22.47 20.4568 20.7137L16.7402 17.8282C15.7105 18.5182 14.3932 18.9259 12.8459 18.9259C9.85068 18.9259 7.31546 16.903 6.41114 14.1848H2.56909V17.1644C4.46136 20.9228 8.35046 23.4998 12.8459 23.4998Z" fill="#34A853"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M6.41117 14.1851C6.18117 13.4951 6.05049 12.758 6.05049 12.0001C6.05049 11.2421 6.18117 10.5051 6.41117 9.81506V6.83551H2.56913C1.79027 8.38801 1.34595 10.1444 1.34595 12.0001C1.34595 13.8557 1.79027 15.6121 2.56913 17.1646L6.41117 14.1851Z" fill="#FBBC05"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.8459 5.07386C14.5343 5.07386 16.0502 5.65409 17.242 6.79364L20.5405 3.49523C18.5489 1.63955 15.9457 0.5 12.8459 0.5C8.35046 0.5 4.46136 3.07705 2.56909 6.83545L6.41114 9.815C7.31546 7.09682 9.85068 5.07386 12.8459 5.07386Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn
