import { AspectRatio } from "@/components/ui/AspectRatio"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Typography } from "@/components/ui/Typography"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Formv2"
import { FormLabel } from "@/components/ui/Form"
import { useAuthContext } from "@/libs/auth"
import { useRouter } from "next/router"

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Email must be a valid email address"),
  password: z.string().min(1, { message: "Password is required" }),
})

const LoginPage = () => {
  const { login } = useAuthContext()
  const { replace } = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.email, values.password)
      replace("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <Form {...form}>
        <form className="mx-auto w-full max-w-[480px] px-4 py-28 lg:px-16" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-10">
            <Typography as="h4" level="body1" className="font-bold">
              Sign in to Moment
            </Typography>
            <div className="mt-4 flex items-center gap-1">
              <Typography level="body4">New user?</Typography>
              <Link href="/register">
                <Typography color="primary" level="body4">
                  Create an account
                </Typography>
              </Link>
            </div>
          </div>
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input fullWidth placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input fullWidth type="password" placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={form.formState.isSubmitting} type="submit" fullWidth className="mt-10">
              Login
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative hidden flex-1 lg:flex">
        <div className="absolute inset-8 flex items-center justify-center">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-3xl">
            <Image src="/assets/background.jpg" fill alt="bg" />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
