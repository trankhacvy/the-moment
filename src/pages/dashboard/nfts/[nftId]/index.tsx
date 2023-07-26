import Link from "next/link"
import { useRouter } from "next/router"
import type { ReactElement } from "react"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NFTDetailView, NFTDetailSkeleton } from "@/components/NFTDetail/NFTDetailView"
import { useNFT } from "@/hooks/useNFT"
import { Button } from "@/components/ui/Button"
import { ChevronLeftIcon } from "lucide-react"
import { DashboardLayout } from "@/components/Layout/Dashboard/Layout"

const NFTDetailPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const nftId = query.nftId as string

  const { nft, isLoading } = useNFT(nftId)

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="mb-6 flex items-center justify-between lg:mb-10">
        <Button as={Link} href={Routes.DASHBOARD} variant="link" startDecorator={<ChevronLeftIcon />}>
          Back
        </Button>
      </div>
      {isLoading ? <NFTDetailSkeleton /> : <NFTDetailView nft={nft} />}
    </div>
  )
}

NFTDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default NFTDetailPage
