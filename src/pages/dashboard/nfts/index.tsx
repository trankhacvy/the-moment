import { PlusIcon } from "lucide-react"
import Link from "next/link"
import type { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NFTList } from "@/components/dashboard/NFTList"

const EventsPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <Typography as="h4" level="h6" className="mb-2 font-bold">
            Your NFTs
          </Typography>
          <div className="flex items-center justify-between">
            <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
              <Typography as="span" level="body4" color="secondary">
                Your NFTs
              </Typography>
            </Breadcrumbs>
          </div>
        </div>
        <Link href={Routes.NEW_NFT}>
          <Button endDecorator={<PlusIcon />}>New NFT</Button>
        </Link>
      </div>

      <NFTList />
    </>
  )
}

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default EventsPage
