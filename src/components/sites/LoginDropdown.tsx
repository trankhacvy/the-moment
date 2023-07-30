import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Typography } from "@/components/ui/Typography"
import { Separator } from "@/components/ui/Separator"
import { truncate } from "@/utils/truncate"
import { Button } from "../ui/Button"
import { LogOutIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/router"
import { cn } from "@/utils/cn"
import Link from "next/link"
import { useUserAuth } from "@/hooks/useUserAuth"
import { client } from "@/libs/api"
import { EmailLoginModal } from "./EmailLoginModal"

export const LoginDropdown = () => {
  const { query } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isEmailLoginOpen, setIsEmailLoginOpen] = useState(false)
  const { isLoggedIn, user, mutateUser } = useUserAuth(null)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {isLoggedIn ? (
          <button>
            <Avatar className="bg-red-200">
              <AvatarImage src={user?.avatar ?? ""} alt={user?.email} />
              <AvatarFallback className="bg-primary-500 text-white font-semibold">
                {user?.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <EmailLoginModal
            isOpen={isEmailLoginOpen}
            onOpenChange={setIsEmailLoginOpen}
            trigger={<Button>Login</Button>}
          />
        )}
      </PopoverTrigger>
      {isLoggedIn && (
        <PopoverContent align="end" className={cn("p-0", "session" ? "w-52" : "w-40")}>
          <div className="px-5 py-3">
            <Typography className="truncate font-semibold" as="h6" level="body4">
              {user?.email ? user?.email : truncate(user?.wallet ?? "", 8, true)}
            </Typography>
          </div>
          <Separator />
          <div className="p-2">
            <Link href={`/claim/${query.slug}/profile`}>
              <li className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8">
                <UserIcon className="text-gray-600" />
                <Typography as="span" level="body4">
                  Profile
                </Typography>
              </li>
            </Link>
          </div>
          <Separator />
          <li
            onClick={() => {
              client.signOut().then(() => {
                setIsOpen(false)
                mutateUser(undefined)
              })
            }}
            className="m-2 flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8"
          >
            <LogOutIcon className="text-red-400" />
            <Typography as="span" color="error" level="body4" className="font-semibold">
              Logout
            </Typography>
          </li>
        </PopoverContent>
      )}
    </Popover>
  )
}
