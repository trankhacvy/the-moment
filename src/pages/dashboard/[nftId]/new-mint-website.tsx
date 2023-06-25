import { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import { NewNFTForm } from "@/components/new-nft/NewNFTForm"

const NewMintWebsite: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create new mint website
        </Typography>
        <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <a href={Routes.DASHBOARD}>
            <Typography as="span" level="body4">
              Dashboard
            </Typography>
          </a>
          <Typography as="span" level="body4" color="secondary">
            New mint website
          </Typography>
        </Breadcrumbs>
      </div>
    </>
  )
}

NewMintWebsite.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export default NewMintWebsite
