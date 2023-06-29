import { PropsWithChildren } from "react"
import { SiteHeader } from "./SiteHeader"

export const SiteLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <SiteHeader />
      {children}
    </div>
  )
}
