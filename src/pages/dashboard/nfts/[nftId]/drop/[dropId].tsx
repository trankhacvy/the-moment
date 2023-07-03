import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, type ReactElement, useState } from "react"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NFTDetail, NFTDetailSkeleton } from "@/components/nft-detail/nft-detail-view"
import { useNFT } from "@/hooks/useNFT"
import { Button } from "@/components/ui/Button"
import { ChevronLeftIcon } from "lucide-react"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { useDrop } from "@/hooks/use-drop"
import { DropDetailView } from "@/components/drop-detail/drop-detail-view"

const DropDetailPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const dropId = query.dropId as string

  const { drop } = useDrop(dropId, {
    refreshInterval: (drop) => (drop?.status === "ACTIVE" ? 0 : 1000),
  })

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:mb-10">
        <Button as={Link} href={Routes.DASHBOARD} variant="link" startDecorator={<ChevronLeftIcon />}>
          Back
        </Button>
      </div>
      <DropDetailView drop={drop} />
    </>
  )
}

DropDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default DropDetailPage
