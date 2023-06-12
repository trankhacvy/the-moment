import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Typography } from "@/components/ui/Typography"
import { truncate } from "@/utils/truncate"
import { Separator } from "@/components/ui/Separator"

const AdminUserMenu = () => {
  const { data: session } = useSession()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar>
            <AvatarImage src={session?.user?.image ?? ""} alt={session?.address} />
            <AvatarFallback>GM</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <div className="px-5 py-3">
          <Typography className="truncate font-semibold" as="h6" level="body4">
            {truncate(session?.address ?? "", 12, true)}
          </Typography>
          <Typography color="secondary" level="body4">
            admin@gmail.com
          </Typography>
        </div>
        <Separator />
        <ul className="p-2">
          <li className="cursor-pointer rounded-md px-2 py-1.5 hover:bg-gray-500/8">
            <Typography as="span" level="body4">
              Home
            </Typography>
          </li>
          <li className="cursor-pointer rounded-md px-2 py-1.5 hover:bg-gray-500/8">
            <Typography as="span" level="body4">
              Profile
            </Typography>
          </li>
          <li className="cursor-pointer rounded-md px-2 py-1.5 hover:bg-gray-500/8">
            <Typography as="span" level="body4">
              Settings
            </Typography>
          </li>
        </ul>
        <Separator />
        <div className="p-2">
          <li
            onClick={() => {
              signOut({
                redirect: true,
                callbackUrl: "/",
              })
            }}
            className="cursor-pointer list-none rounded-md px-2 py-1.5 hover:bg-gray-500/8"
          >
            <Typography as="span" level="body4">
              Logout
            </Typography>
          </li>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { AdminUserMenu }
