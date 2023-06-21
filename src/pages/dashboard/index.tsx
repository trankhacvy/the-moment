import { PlusIcon } from "lucide-react"
import Link from "next/link"
import type { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NFTDropsTabs } from "@/components/dashboard/NFTDropsTabs"

const EventsPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          NFT Drops
        </Typography>
        <div className="flex items-center justify-between">
          <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
            <Link href={Routes.DASHBOARD}>
              <Typography as="span" level="body4">
                Home
              </Typography>
            </Link>
            <Typography as="span" level="body4" color="secondary">
              NFT Drops
            </Typography>
          </Breadcrumbs>
          <Link href={Routes.NEW_NFT_DROP}>
            <Button endDecorator={<PlusIcon />}>New NFT drop</Button>
          </Link>
        </div>
      </div>

      <NFTDropsTabs />
    </>
  )
}

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default EventsPage
