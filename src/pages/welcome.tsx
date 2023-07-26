import { SiteHeader } from "@/components/sites/SiteHeader"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { Routes } from "@/config/routes"
import { useUserAuth } from "@/hooks/useUserAuth"
import { client } from "@/libs/api"
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

type SignErrorType = "INVALID_LINK" | "SERVER_ERROR"

const WelcomePage: NextPage = () => {
  const { query, isReady, replace } = useRouter()
  const { token, redirectUrl } = query
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorSigningIn, setErrorSignIn] = useState<SignErrorType | undefined>()
  const { mutateUser } = useUserAuth(null)

  useEffect(() => {
    if (!isReady) return

    if (!token) {
      replace(Routes.INDEX)
      return
    }
    setIsSigningIn(true)
    client
      .magicLinkCallback(token as string)
      .then(() => {
        setIsSigningIn(false)
        mutateUser().then(() => {
          replace((redirectUrl as string) ?? Routes.DASHBOARD)
        })
      })
      .catch((error) => {
        console.error(error)
        setErrorSignIn("SERVER_ERROR")
        setIsSigningIn(false)
      })
  }, [token, isReady, redirectUrl, mutateUser, replace])

  return (
    <div className="bg-blur-image">
      <SiteHeader />

      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-card">
          {isSigningIn ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-5">
              <Loader2Icon className="w-20 h-20 text-primary-500 animate-spin" />
              <Typography as="h2" level="h4" className="font-bold">
                Signing you in...
              </Typography>
              <Typography color="secondary">Please wait while we are preparing your take off.</Typography>
            </div>
          ) : errorSigningIn ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <XCircleIcon className="w-20 h-20 text-error-500" />
              <Typography as="h2" level="h4" className="font-bold">
                Error
              </Typography>
              <div className="text-brand-secondary flex gap-2 text-sm font-medium">
                {/* Oops! The magic link is invalid or has expired. Please request a new one */}
                <Typography>Oops! The magic link is invalid or has expired.</Typography>
              </div>
              <Link href={Routes.INDEX} replace>
                <Button>Go to home</Button>
              </Link>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
              <CheckCircle2Icon className="w-20 h-20 text-success-500" />
              <Typography as="h2" level="h4" className="font-bold">
                Success
              </Typography>
              <Typography>Redirecting you to the app...</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
