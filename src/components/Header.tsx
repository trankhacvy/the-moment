import Link from "next/link"
import { Typography } from "@/components/ui/Typography"
import { Button } from "./ui/Button"

export const Header = () => {
  return (
    <header className="fixed left-0 top-0 w-full">
      <div className="h-16 min-h-[48px] lg:h-[88px] lg:min-h-[64px]">
        <div className="container mx-auto flex h-full w-full items-center px-4 md:px-6">
          <div className="h-5 w-[75px] rounded-xl bg-green-200" />
          <nav className="ml-12 flex h-full items-center gap-12">
            <Link className="hover:opacity-32" href="/">
              <Typography className="text-white" level="body4">
                Home
              </Typography>
            </Link>
            <Link href="/">
              <Typography className="text-white" level="body4">
                Home
              </Typography>
            </Link>
            <Link href="/">
              <Typography className="text-white" level="body4">
                Home
              </Typography>
            </Link>
            <Link href="/">
              <Typography className="text-white" level="body4">
                Home
              </Typography>
            </Link>
          </nav>
          <div className="flex flex-1 justify-end">
            <Button>Login</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
