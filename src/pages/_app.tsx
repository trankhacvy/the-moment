import "../styles/global.css"
require("@solana/wallet-adapter-react-ui/styles.css")
import { DefaultSeo } from "next-seo"
import "isomorphic-unfetch"
import type { AppProps } from "next/app"
import { ReactElement } from "react"
import { SolanaProvider } from "@/components/SolanaProvider"
import { NextPageWithLayout } from "@/types"
import { Toaster } from "@/components/ui/Toast"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"
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
            url: `${APP_BASE_URL}/og.png`,
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

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page)

  return (
    <>
      <SEORender />
      <SolanaProvider>
        <TooltipProvider delayDuration={100}>{getLayout(<Component {...pageProps} />)}</TooltipProvider>
        <Toaster />
      </SolanaProvider>
    </>
  )
}

export default MyApp
