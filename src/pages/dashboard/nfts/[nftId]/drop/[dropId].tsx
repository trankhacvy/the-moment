import Link from "next/link"
import { useRouter } from "next/router"
import { type ReactElement } from "react"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { Button } from "@/components/ui/Button"
import { ChevronLeftIcon } from "lucide-react"
import { DashboardLayout } from "@/components/Layout/Dashboard/Layout"
import { useDrop } from "@/hooks/useDrop"
import { DropDetailView } from "@/components/DropDetail/DropDetail-view"

const DropDetailPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const nftId = query.nftId as string
  const dropId = query.dropId as string

  const { drop } = useDrop(dropId, {
    // refreshInterval: (drop) => (drop?.status === "ACTIVE" ? 0 : 1000),
  })

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:mb-10">
        <Button as={Link} href={Routes.NFT_DETAIL(nftId)} variant="link" startDecorator={<ChevronLeftIcon />}>
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
