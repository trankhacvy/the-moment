import { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NewNFTForm } from "@/components/new-nft/NewNFTForm"
import { useRouter } from "next/router"
import { useNFT } from "@/hooks/useNFT"
import { Skeleton } from "@/components/ui/Skeleton"

const EditNFTPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const nftId = query.nftId as string

  const { nft, isLoading } = useNFT(nftId)

  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Edit NFT
        </Typography>
        <Breadcrumbs aria-label="New NFT" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <a href={Routes.DASHBOARD}>
            <Typography as="span" level="body4">
              NFTs
            </Typography>
          </a>
          {isLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : (
            <Typography as="span" level="body4" color="secondary">
              {nft?.name}
            </Typography>
          )}
        </Breadcrumbs>
      </div>
      <NewNFTForm isEdit nft={nft} />
    </>
  )
}

EditNFTPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default EditNFTPage