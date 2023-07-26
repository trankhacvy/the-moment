import { MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/IconButton"
import { cn } from "@/utils/cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Typography } from "@/components/ui/Typography"
import { Separator } from "@/components/ui/Separator"
import { truncate } from "@/utils/truncate"
import { Routes } from "@/config/routes"
import { useUser } from "@/hooks/useUser"
import { client } from "@/libs/api"
import { useRouter } from "next/router"

export const DashboardHeader = () => {
  const [small, setSmall] = useState(false)

  useEffect(() => {
    function handler() {
      setSmall(window.pageYOffset > 60)
    }

    window.addEventListener("scroll", handler)

    return () => {
      window.removeEventListener("scroll", handler)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-[40] h-16 w-full transition-[height] duration-200 ease-in-out lg:h-24 lg:w-[calc(100%-281px)]",
        { "lg:h-[60px]": small }
      )}
    >
      <div className="relative flex h-full min-h-[56px] items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <IconButton className="mr-2 lg:hidden" size="sm">
          <MenuIcon />
        </IconButton>
        <div className="flex grow items-center justify-end gap-2">
          <AdminUserMenu />
        </div>
      </div>
    </header>
  )
}

const AdminUserMenu = () => {
  const { user, mutateUser } = useUser()
  const router = useRouter()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar>
            <AvatarImage src={user?.avatar ?? ""} alt={user?.firstName} />
            <AvatarFallback className="bg-primary-500 text-white text-xl">
              {/* <UserIcon /> */}
              {user?.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <div className="px-5 py-3">
          <Typography className="truncate font-semibold" as="h6" level="body4">
            {user?.email ? user.email : truncate(user?.wallet ?? "", 8, true)}
          </Typography>
        </div>
        <Separator />
        <div className="p-2">
          <li
            onClick={() => {
              client.signOut().then(() => {
                mutateUser(undefined)
                router.replace(Routes.INDEX)
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
