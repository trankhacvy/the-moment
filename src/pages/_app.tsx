import "../styles/global.css"
require("@solana/wallet-adapter-react-ui/styles.css")
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { ReactElement } from "react"
import { SolanaProvider } from "@/components/SolanaProvider"
import { NextPageWithLayout } from "@/types"
import { Toaster } from "@/components/ui/Toast"

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <SolanaProvider>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </SessionProvider>
    </SolanaProvider>
  )
}

export default MyApp
