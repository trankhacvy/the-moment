import "../styles/global.css"
require("@solana/wallet-adapter-react-ui/styles.css")
import "isomorphic-unfetch"
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { ReactElement } from "react"
import { SolanaProvider } from "@/components/SolanaProvider"
import { NextPageWithLayout } from "@/types"
import { Toaster } from "@/components/ui/Toast"
import { AuthProvider } from "@/libs/auth"
import { TooltipProvider } from "@/components/ui/Tooltip"

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <SolanaProvider>
      <AuthProvider>
        {/* <SessionProvider session={pageProps.session} refetchInterval={0}> */}
        <TooltipProvider delayDuration={100}>{getLayout(<Component {...pageProps} />)}</TooltipProvider>
        <Toaster />
        {/* </SessionProvider> */}
      </AuthProvider>
    </SolanaProvider>
  )
}

export default MyApp
