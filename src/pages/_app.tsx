import "../styles/global.css"
require("@solana/wallet-adapter-react-ui/styles.css")
import { DefaultSeo } from "next-seo"
import "isomorphic-unfetch"
import type { AppProps } from "next/app"
import { SessionProvider, useSession } from "next-auth/react"
import { PropsWithChildren, ReactElement, useEffect } from "react"
import { SolanaProvider } from "@/components/SolanaProvider"
import { NextPageWithLayout } from "@/types"
import { Toaster } from "@/components/ui/Toast"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"
import { client } from "@/libs/api"
import { siteConfig } from "@/config/site"

const SEORender = () => {
  const { asPath } = useRouter()

  return (
    <DefaultSeo
      title={siteConfig.name}
      openGraph={{
        type: "website",
        locale: "vi_VN",
        description: siteConfig.description,
        site_name: siteConfig.name,
        title: siteConfig.name,
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
      description={siteConfig.description}
    />
  )
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const AppWrapper = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession()
  client.setAuthToken(session?.user?.token?.accessToken ?? "")

  return <>{children}</>
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <>
      <SEORender />
      <SolanaProvider>
        <SessionProvider session={pageProps.session}>
          <TooltipProvider delayDuration={100}>
            <AppWrapper>{getLayout(<Component {...pageProps} />)}</AppWrapper>
          </TooltipProvider>
          <Toaster />
        </SessionProvider>
      </SolanaProvider>
    </>
  )
}

export default MyApp
