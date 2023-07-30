import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { LoginDropdown } from "./LoginDropdown"
import ConnectWalletButton from "../ConnectWalletButton"

export const SiteHeader = ({ showLogin = false }: { showLogin?: boolean }) => {
  return (
    <header className="fixed left-0 top-0 z-[1000] w-full">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/">
          <Image width={48} height={40} src="/assets/logo.png" alt={siteConfig.name} />
        </Link>
        <div className="flex items-center gap-4">
          <ConnectWalletButton />
          {showLogin && <LoginDropdown />}
        </div>
      </div>
    </header>
  )
}
