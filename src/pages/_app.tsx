import "../styles/global.css"
import { DefaultSeo } from "next-seo"
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
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"

const SEORender = () => {
  const { asPath } = useRouter()

  return (
    <DefaultSeo
      title="Moment"
      openGraph={{
        type: "website",
        locale: "vi_VN",
        description: "The first gasless POAP dispenser on Solana blockchain",
        site_name: "Moment",
        title: "Moment",
        url: `${APP_BASE_URL}${asPath}`,
        images: [
          {
            width: 584,
            height: 584,
            url: `${APP_BASE_URL}/og-image.jpeg`,
          },
        ],
      }}
      twitter={{
        cardType: "summary",
      }}
      description='"The first gasless POAP dispenser on Solana blockchain"'
    />
  )
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <>
      <SEORender />
      <SolanaProvider>
        <AuthProvider>
          <SessionProvider session={pageProps.session}>
            <TooltipProvider delayDuration={100}>{getLayout(<Component {...pageProps} />)}</TooltipProvider>
            <Toaster />
          </SessionProvider>
        </AuthProvider>
      </SolanaProvider>
    </>
  )
}

export default MyApp
