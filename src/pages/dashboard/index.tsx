import { PlusIcon } from "lucide-react"
import Link from "next/link"
import type { ReactElement } from "react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { DashboardLayout } from "@/components/Layout/Dashboard/Layout"

const EventsPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Your NFTs
        </Typography>
        <div className="flex items-center justify-between">
          <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
            <Link href={Routes.DASHBOARD}>
              <Typography as="span" level="body4">
                Home
              </Typography>
            </Link>
            <Typography as="span" level="body4" color="secondary">
              Your NFTs
            </Typography>
          </Breadcrumbs>
          <Link href={Routes.NEW_NFT}>
            <Button endDecorator={<PlusIcon />}>New NFT</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default EventsPage
