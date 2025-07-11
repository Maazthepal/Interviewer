"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import ForomField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { storeUserIP } from "@/lib/utils"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})


const authFormSchema = (type: FormType) => {
    return z.object({
      name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
      email: z.string().email(),
      password: z.string().min(3)
    })
  }


const AuthForm = ({ type }: { type: FormType}) => {
  const router = useRouter()
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })
 

 async function onSubmit(values: z.infer<typeof formSchema>) {
   try {
    if(type === 'sign-up') {
      const { name, email, password } = values;

      const userCredentials = await createUserWithEmailAndPassword(auth , email, password) 

      const result = await signUp({
        uid: userCredentials.user.uid,
        name: name!,
        email,
        password
      })

      if(!result?.succes) {
        toast.error(result.message);
        return
      }

      await storeUserIP(userCredentials.user.uid)
      toast.success("Account Created succesfully. Please sign in.")
      router.push('/sign-in')
    } else {
      const { email , password } = values;

      const userCredentials = await signInWithEmailAndPassword(auth, email, password)

      const idToken = await userCredentials.user.getIdToken();
      if(!idToken ) {
        toast.error("Sign in failed")
        return
      }
      await signIn({
        email, idToken
      })
      await storeUserIP(userCredentials.user.uid)
      toast.success("Sign in succesfully")
      router.push('/')
    }
   } catch(error) {
    console.log(error)
    toast.error(`There was an error ${error}`)
   }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]" >
      <div className="flex flex-col gap-6 card py-14 px-10" > 
        <div className="flex flex-row gap-2 justify-center" >
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100" >Interviewer</h2>
        </div>
        <h3>Practice Job Interviews with AI</h3>
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
       {!isSignIn && (
        <ForomField control={form.control} name="name" label="Name" placeholder="your Name" />
       )}
       <ForomField control={form.control} name="email" label="E-mail" placeholder="your Email Address" type="email" />
       <ForomField control={form.control} name="password" label="Password" placeholder="Enter Your Password" type="password" />
        <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create An Account'}</Button>
      </form>
    </Form>

    <p className="text-center" >
      {isSignIn ? 'No Account Yet?': "Have an account already?"}
      <Link href={!isSignIn ? '/sign-in': '/sign-up' } className="font-bold text-user-primary ml-1">
        {!isSignIn ? 'Sign in' : 'Sign up' }
      </Link>
    </p>
    </div>
    </div>
  )
}

export default AuthForm