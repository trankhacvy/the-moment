import { SiteHeader } from "@/components/sites/SiteHeader"
import { Typography } from "@/components/ui/Typography"
import { useUserAuth } from "@/hooks/use-user-auth"
import { client } from "@/libs/api"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

type SignErrorType = "INVALID_LINK" | "SERVER_ERROR"

const WelcomePage: NextPage = () => {
  const { query, isReady, push } = useRouter()
  const { token, redirectUrl } = query
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorSigningIn, setErrorSignIn] = useState<SignErrorType | undefined>()
  const { mutateUser } = useUserAuth("sign-in")

  useEffect(() => {
    console.log("query", query, isReady)
    if (!isReady) return

    if (!token) {
      setErrorSignIn("INVALID_LINK")
      return
    }
    setIsSigningIn(true)
    client
      .magicLinkCallback(token as string)
      .then(() => {
        setIsSigningIn(false)
        mutateUser()
      })
      .catch((error) => {
        setErrorSignIn("SERVER_ERROR")
        setIsSigningIn(false)
      })
  }, [token, isReady, redirectUrl, mutateUser])

  return (
    <div className="bg-gradient-to-r from-[#C9FFBF] to-[#FFAFBD]">
      <SiteHeader />

      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-card">
          {isSigningIn ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-5">
              <Typography as="h2" level="h4" className="font-bold">
                Signing you in...
              </Typography>
              <Typography color="secondary">Please wait while we are preparing your take off.</Typography>
            </div>
          ) : errorSigningIn ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <Typography as="h2" level="h4" className="font-bold">
                Error
              </Typography>
              <div className="text-brand-secondary flex gap-2 text-sm font-medium">
                <Typography>{errorSigningIn}.</Typography>
                {/* <span className="cursor-pointer underline">Send link again?</span> */}
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
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
