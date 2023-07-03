import { SiteHeader } from "@/components/sites/SiteHeader"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { Routes } from "@/config/routes"
import Link from "next/link"

const NotFoundPage = () => {
  return (
    <div className="bg-gradient-to-r from-[#C9FFBF] to-[#FFAFBD]">
      <SiteHeader />

      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-card">
          <Typography as="h4" level="body1" className="mb-5 font-bold">
            Sorry, Page Not Found
          </Typography>
          <Typography color="secondary" className="mb-10" as="p">
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>
          <Link href={Routes.INDEX}>
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
