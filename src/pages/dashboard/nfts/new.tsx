import { ReactElement } from "react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NewNFTForm } from "@/components/NewNFT/NewNFTForm"
import { DashboardLayout } from "@/components/Layout/Dashboard/Layout"

const NewNFTPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create a new NFT
        </Typography>
        <Breadcrumbs aria-label="New NFT" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <a href={Routes.DASHBOARD}>
            <Typography as="span" level="body4">
              NFTs
            </Typography>
          </a>
          <Typography as="span" level="body4" color="secondary">
            New NFT
          </Typography>
        </Breadcrumbs>
      </div>
      <NewNFTForm />
    </>
  )
}

NewNFTPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default NewNFTPage
