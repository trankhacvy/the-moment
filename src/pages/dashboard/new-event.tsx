import { NextPageContext } from "next"
import { getServerSession } from "next-auth/next"
import { ReactElement, useState } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { AspectRatio } from "@/components/AspectRatio"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { CreateEventForm } from "@/components/CreateEventForm"
import { Typography } from "@/components/Typography"
import { Uploader } from "@/components/Uploader"
import { NextPageWithLayout } from "@/types"
import { authOptions } from "@/utils/authOptions"

const CreatePage: NextPageWithLayout = () => {
  const [image, setImage] = useState<File>()
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create a new event
        </Typography>
        <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <a href="/dashboard">
            <Typography as="span" level="body4">
              Dashboard
            </Typography>
          </a>
          <Typography as="span" level="body4" color="secondary">
            New event
          </Typography>
        </Breadcrumbs>
      </div>
      {/* form */}
      <div className="flex gap-6">
        <div className="basis-1/3 self-start rounded-2xl bg-white shadow-card">
          <AspectRatio>
            <Uploader className="h-full" maxFiles={1} onChange={(files) => setImage(files?.[0])} />
          </AspectRatio>
        </div>
        <CreateEventForm image={image} />
      </div>
    </>
  )
}

CreatePage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export async function getServerSideProps(context: NextPageContext) {
  // @ts-ignore
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default CreatePage
