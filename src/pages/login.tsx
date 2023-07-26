import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Typography } from "@/components/ui/Typography"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Formv2"
import { FormLabel } from "@/components/ui/Form"
import { siteConfig } from "@/config/site"
import { useState } from "react"
import { client } from "@/libs/api"
import { MailCheck } from "lucide-react"
import { Routes } from "@/config/routes"
import { SiteHeader } from "@/components/sites/SiteHeader"
import { APP_BASE_URL } from "@/config/env"

const formSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required" }).email("Email must be a valid email address"),
})

const LoginPage = () => {
  const [codeSent, setCodeSent] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const wEmail = form.watch("email")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await client.loginByMagicLink(values.email, `${APP_BASE_URL}/welcome`)
      setCodeSent(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-blur-image">
      <SiteHeader />

      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-card">
          {codeSent ? (
            <div className="text-center">
              <MailCheck className="inline h-16 w-16 text-info-700" />
              <div className="py-10">
                <Typography as="h2" level="h5" className="font-bold">
                  Magic Link Sent
                </Typography>
                <Typography className="mt-2 leading-normal" color="secondary" as="p">
                  We just sent an email to you at
                  <br /> <b className="text-gray-900">{wEmail}</b>
                  <br /> It contains a link that'll sign you in super quick.
                </Typography>
              </div>
              <Link href={Routes.INDEX} replace>
                <Button scheme="default">Back to home</Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-10">
                  <Typography as="h4" level="body1" className="font-bold">
                    Sign in to {siteConfig.name}
                  </Typography>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input fullWidth placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button size="lg" loading={form.formState.isSubmitting} type="submit" fullWidth className="mt-10">
                  Login
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
