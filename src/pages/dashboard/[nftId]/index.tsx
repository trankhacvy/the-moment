import dayjs from "dayjs"
// import { CalendarDaysIcon, EditIcon, ExternalLinkIcon, MapPinIcon, Share2Icon } from "lucide-react"
// import { NextPageContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
// import { getServerSession } from "next-auth/next"
import type { ReactElement } from "react"
// import useSWR from "swr"
import { AdminLayout } from "@/components/AdminLayout"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
// import { Button } from "@/components/ui/Button"
// import { IconButton } from "@/components/ui/IconButton"
// import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { Typography } from "@/components/ui/Typography"
// import { Supabase } from "@/libs/supabase"
import { NextPageWithLayout } from "@/types"
// import { authOptions } from "@/utils/authOptions"
// import { EventDetailTabs } from "@/components/event-detail/EventDetailTabs"
import { useNFTDrop } from "@/hooks/useNFTDrop"
import { Routes } from "@/config/routes"
import { NFTDropDetail } from "@/components/drop-detail/NFTDropDetail"
import { useNFT } from "@/hooks/useNFT"

const EventDetail: NextPageWithLayout = () => {
  const { query } = useRouter()
  const nftId = query.nftId as string

  const { nft, isLoading } = useNFT(nftId)

  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Event detail
        </Typography>
        <div className="flex items-center justify-between">
          {isLoading ? (
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-32" />
            </div>
          ) : (
            <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
              <Link href={Routes.DASHBOARD}>
                <Typography as="span" level="body4">
                  Home
                </Typography>
              </Link>
              <Link href={Routes.DASHBOARD}>
                <Typography as="span" level="body4">
                  NFT Drops
                </Typography>
              </Link>
              <Typography as="span" level="body4" color="secondary">
                {nft?.name}
              </Typography>
            </Breadcrumbs>
          )}
        </div>
      </div>

      {isLoading ? <NFTDropSkeleton /> : <NFTDropDetail nft={nft} />}

      {/* {isLoading ? (
        <NFTDropSkeleton />
      ) : (
        <div className="flex gap-6">
          <div className="basis-1/3">
            <AspectRatio>
              <img className="h-auto w-full rounded-xl" alt={event?.name ?? ""} src={event?.logo ?? ""} />
            </AspectRatio>
          </div>
          <div className="basis-2/3">
            <div className="mb-2 flex items-center gap-1 text-gray-500">
              <CalendarDaysIcon className="h-5 w-5" />
              <Typography as="span" level="body4" color="secondary">
                {dayjs(event?.start_date).format("MMM DD, YYYY")}
              </Typography>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <Typography as="h2" level="h4" className="font-semibold">
                {event?.name}
              </Typography>
              <div className="flex gap-2">
                <IconButton size="sm">
                  <EditIcon />
                </IconButton>
                <IconButton as="a" target="_blank" href={`/events/${eventId}`} size="sm">
                  <ExternalLinkIcon />
                </IconButton>
              </div>
            </div>
            <Typography color="secondary">{event?.description}</Typography>
            <div className="mt-10">
              <Typography as="h6" level="body1" className="mb-6 font-semibold">
                Where and when
              </Typography>
              <div className="flex gap-10">
                <div className="flex items-start gap-4">
                  <CalendarDaysIcon className="h-6 w-6" />
                  <div>
                    <Typography level="body4" as="p" color="secondary">
                      Date and time
                    </Typography>
                    <Typography className="mt-1">
                      {dayjs(event?.start_date).format("DD/MM/YYYY")}-{dayjs(event?.end_date).format("DD/MM/YYYY")}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPinIcon className="h-6 w-6" />
                  <div>
                    <Typography level="body4" as="p" color="secondary">
                      Location
                    </Typography>
                    <Typography className="mt-1">
                      {event?.event_type === "in_person" ? event.location : "Online"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-10" />
            {!eventDrop && (
              <Link href={`/dashboard/${eventId}/new-drop`}>
                <Button fullWidth>Distribute your event POAP</Button>
              </Link>
            )}
          </div>
        </div>
      )} */}

      {/* {eventDrop && <EventDetailTabs eventId={eventId} dropId={eventDrop.id} name={event.name!} />}  */}
    </>
  )
}

const NFTDropSkeleton = () => {
  return (
    <div className="flex gap-6">
      <div className="basis-1/2">
        <AspectRatio>
          <Skeleton className="h-full w-full rounded-2xl" />
        </AspectRatio>
      </div>
      <div className="basis-1/2 space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

EventDetail.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

// export async function getServerSideProps(context: NextPageContext) {
//   // @ts-ignore
//   const session = await getServerSession(context.req, context.res, authOptions)

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {
//       session,
//     },
//   }
// }

export default EventDetail
