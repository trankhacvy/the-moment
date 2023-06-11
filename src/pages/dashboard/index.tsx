import { PlusIcon } from "lucide-react"
import { NextPageContext } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import type { ReactElement } from "react"
import useSWR from "swr"
import { AdminLayout } from "@/components/AdminLayout"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/Button"
import { EventItem, EventItemSkeleton } from "@/components/EventItem"
import { Typography } from "@/components/Typography"
import { Supabase } from "@/libs/supabase"
import { NextPageWithLayout } from "@/types"
import { authOptions } from "@/utils/authOptions"
import { useSession } from "next-auth/react"

const EventsPage: NextPageWithLayout = () => {
  const { data: session } = useSession()
  const { data, isLoading } = useSWR(session?.address ? ["events", session.address] : null, async () => {
    const { data, error } = await Supabase.from("poap_events").select("*").eq("creator", session?.address)
    if (error) throw error
    return data
  })

  let eventList = null
  if (isLoading) {
    eventList = Array.from({ length: 5 }).map((_, idx) => <EventItemSkeleton key={idx} />)
  } else {
    eventList = (data ?? []).map((item) => (
      <EventItem id={item.id!} name={item.name!} cover={item.logo!} description={item.description!} key={item.id} />
    ))
  }

  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Events
        </Typography>
        <div className="flex items-center justify-between">
          <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
            <Link href="/dashboard">
              <Typography as="span" level="body4">
                Home
              </Typography>
            </Link>
            <Typography as="span" level="body4" color="secondary">
              Events
            </Typography>
          </Breadcrumbs>
          <Link href="/dashboard/new-event">
            <Button endDecorator={<PlusIcon />}>Create event</Button>
          </Link>
        </div>
      </div>
      {/* tabs */}
      <div className="space-y-6">{eventList}</div>
    </>
  )
}

EventsPage.getLayout = function getLayout(page: ReactElement) {
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

export default EventsPage
