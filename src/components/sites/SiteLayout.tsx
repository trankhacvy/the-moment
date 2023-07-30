import { PropsWithChildren } from "react"
import { SiteHeader } from "./SiteHeader"
import { SolanaProvider } from "../SolanaProvider"

export const SiteLayout = ({ children }: PropsWithChildren) => {
  return (
    <SolanaProvider>
      <div className="relative flex min-h-screen w-full flex-col bg-blur-image">
        <SiteHeader showLogin />
        {children}
      </div>
    </SolanaProvider>
  )
}
