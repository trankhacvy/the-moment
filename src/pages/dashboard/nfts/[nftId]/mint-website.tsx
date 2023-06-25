import { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NewMintWebsiteForm } from "@/components/nft-detail/NewMintWebsiteForm"
import { useRouter } from "next/router"

const NewMintWebsite: NextPageWithLayout = () => {
  const { query } = useRouter()
  const nftId = query.nftId as string

  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create a mint website
        </Typography>
        <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <a href={Routes.DASHBOARD}>
            <Typography as="span" level="body4">
              NFTs
            </Typography>
          </a>
          <Typography as="span" level="body4" color="secondary">
            New mint website
          </Typography>
        </Breadcrumbs>
      </div>
      <NewMintWebsiteForm nftId={nftId} />
    </>
  )
}

NewMintWebsite.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default NewMintWebsite
