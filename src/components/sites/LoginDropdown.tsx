import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Typography } from "@/components/ui/Typography"
import { Separator } from "@/components/ui/Separator"
import { truncate } from "@/utils/truncate"
import { Button, ButtonProps } from "../ui/Button"
import { LogOutIcon, MailIcon, UserIcon, WalletIcon } from "lucide-react"
import { useRef, useState } from "react"
import { useWalletLogin } from "@/utils/authOptions"
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

  const btnLoginRef = useRef<HTMLButtonElement>(null)
  const dumpRef = useRef<HTMLButtonElement | null>(null)

  const loginWithWallet = useWalletLogin()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {isLoggedIn ? (
          <button>
            <Avatar>
              <AvatarImage src={user?.avatar ?? ""} alt={user?.firstName} />
              <AvatarFallback>😃</AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <Button ref={btnLoginRef} scheme="default">
            Login
          </Button>
        )}
      </PopoverTrigger>
      {isLoggedIn ? (
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
      ) : (
        <PopoverContent
          align="end"
          className="w-40 p-0"
          hidden={isEmailLoginOpen}
          onCloseAutoFocus={() => {
            if (dumpRef.current) {
              dumpRef.current.focus()
              dumpRef.current = null
              event?.preventDefault()
            }
          }}
        >
          <li
            onClick={() => {
              setIsOpen(false)
              loginWithWallet()
            }}
            className="m-2 flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8"
          >
            <WalletIcon className="text-gray-600" />
            <Typography as="span" level="body4">
              Use Wallet
            </Typography>
          </li>
          <EmailLoginModal
            isOpen={isEmailLoginOpen}
            onOpenChange={(open) => {
              setIsEmailLoginOpen(open)
              if (open === false) {
                setIsOpen(false)
              }
            }}
            trigger={
              <li
                onClick={() => {
                  dumpRef.current = btnLoginRef.current
                }}
                className="m-2 flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8"
              >
                <MailIcon className="text-gray-600" />
                <Typography as="span" level="body4">
                  Use Email
                </Typography>
              </li>
            }
          />
        </PopoverContent>
      )}
    </Popover>
  )
}
