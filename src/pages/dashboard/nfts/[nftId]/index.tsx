import Link from "next/link"
import { useRouter } from "next/router"
import type { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NFTDetail, NFTDetailSkeleton } from "@/components/nft-detail/NFTDetail"
import { useNFT } from "@/hooks/useNFT"
import { Button } from "@/components/ui/Button"
import { ChevronLeftIcon } from "lucide-react"

const NFTDetailPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const nftId = query.nftId as string

  const { nft, isLoading } = useNFT(nftId)

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:mb-10">
        <Button as={Link} href={Routes.DASHBOARD} variant="link" startDecorator={<ChevronLeftIcon />}>
          Back
        </Button>
      </div>

      {isLoading ? <NFTDetailSkeleton /> : <NFTDetail nft={nft} />}
    </>
  )
}

NFTDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default NFTDetailPage
