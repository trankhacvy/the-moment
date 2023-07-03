import { useForm } from "react-hook-form"
import { Typography } from "@/components/ui/Typography"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Formv2"
import { Button } from "@/components/ui/Button"
import { IconButton } from "../ui/IconButton"
import { MailCheck, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "../ui/Toast"
import { client } from "@/libs/api"
import { siteConfig } from "@/config/site"
import { Input } from "../ui/Input"
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"

type EmailLoginModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Email must be a valid email address"),
})

export const EmailLoginModal = ({ trigger, isOpen = false, onOpenChange }: EmailLoginModalProps) => {
  const [codeSent, setCodeSent] = useState(false)
  const { toast } = useToast()
  const { asPath } = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const wEmail = form.watch("email")

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await client.loginByMagicLink(
        values.email,
        `${APP_BASE_URL}/welcome`,
        encodeURIComponent(`${APP_BASE_URL}${asPath}?claim=email`)
      )
      setCodeSent(true)
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setCodeSent(false)
      form.reset()
    }
  }, [isOpen, form])

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-sm">
          {!codeSent && (
            <AlertDialogHeader>
              <AlertDialogTitle>Sign in to {siteConfig.name}</AlertDialogTitle>
            </AlertDialogHeader>
          )}
          {codeSent ? (
            <div className="text-center">
              <MailCheck className="inline h-16 w-16 text-info-700" />
              <div className="mt-6">
                <Typography as="h2" level="h5" className="font-bold">
                  Magic Link Sent
                </Typography>
                <Typography className="mt-2 leading-normal" color="secondary" as="p">
                  We just sent an email to you at
                  <br />
                  <b className="text-gray-900">{wEmail}</b>
                  <br />
                  It contains a link that'll sign you in super quick.
                </Typography>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <AlertDialogFooter>
                  <Button loading={form.formState.isSubmitting} scheme="default" type="submit" fullWidth>
                    Login
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          )}

          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 !shadow-none hover:bg-gray-800/8 focus:ring-0"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </IconButton>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
