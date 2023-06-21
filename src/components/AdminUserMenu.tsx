import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Typography } from "@/components/ui/Typography"
import { Separator } from "@/components/ui/Separator"
import { useAuthContext } from "@/libs/auth"

const AdminUserMenu = () => {
  const { user, logout } = useAuthContext()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar>
            <AvatarImage src={user?.avatar ?? ""} alt={user?.firstName} />
            <AvatarFallback>GM</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <div className="px-5 py-3">
          <Typography className="truncate font-semibold" as="h6" level="body4">
            {user?.email}
          </Typography>
        </div>
        <Separator />
        <div className="p-2">
          <li
            onClick={() => {
              logout()
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
