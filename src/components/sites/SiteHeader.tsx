import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { LoginDropdown } from "./LoginDropdown"

export const SiteHeader = () => {
  return (
    <header className="fixed left-0 top-0 z-[1000] w-full">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/">
          <Image width={48} height={40} src="/assets/logo.png" alt={siteConfig.name} />
        </Link>
        <LoginDropdown />
      </div>
    </header>
  )
}
