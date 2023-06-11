import { CalendarIcon, GlobeIcon } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"
import { Separator } from "@/components/Separator/Separator"
import { Typography } from "@/components/Typography"
import { Skeleton } from "./Skeleton/Skeleton"

type EventItemProps = {
  id: string
  name: string
  description: string
  cover: string
}

export const EventItem = ({ id, name, description, cover }: EventItemProps) => {
  return (
    <div className="flex gap-6 rounded-xl p-6 shadow-card transition-shadow duration-200 ease-in-out hover:shadow-dropdown">
      <Avatar className="h-64 w-64" variant="rounded">
        <AvatarImage src={cover} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <div>
        <div>
          <Link href={`/dashboard/${id}`}>
            <Typography as="h6" level="body2" className="font-semibold hover:underline">
              {name}
            </Typography>
          </Link>
          <Typography className="mt-2" color="secondary" level="body4">
            {description}
          </Typography>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Typography level="body4" color="secondary" className="flex gap-2">
            <CalendarIcon className="h-5 w-5" />
            Ho Chi Minh
          </Typography>
          <Separator className="" orientation="vertical" />
          <Typography level="body4" color="secondary" className="flex gap-2">
            <GlobeIcon className="h-5 w-5" />
            Zoom
          </Typography>
        </div>
      </div>
    </div>
  )
}

export const EventItemSkeleton = () => {
  return (
    <div className="flex gap-6 rounded-xl p-6 shadow-card transition-shadow duration-200 ease-in-out hover:shadow-dropdown">
      <Skeleton className="h-64 w-64 shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-4 w-2/3" />
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-1/2" />
      </div>
    </div>
  )
}
