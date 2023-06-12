import { MenuIcon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/IconButton"
import { cn } from "@/utils/cn"
import { AdminUserMenu } from "./AdminUserMenu"

const AdminHeader = () => {
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
        "fixed right-0 top-0 z-[40] h-16 w-full bg-white/80 backdrop-blur-sm transition-[height] duration-200 ease-in-out lg:h-24 lg:w-[calc(100%-281px)]",
        { "lg:h-[60px]": small }
      )}
    >
      <div className="relative flex h-full min-h-[56px] items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <IconButton className="mr-2 lg:hidden" size="sm">
          <MenuIcon />
        </IconButton>
        <IconButton size="sm">
          <SearchIcon />
        </IconButton>
        <div className="flex grow items-center justify-end gap-2">
          <AdminUserMenu />
        </div>
      </div>
    </header>
  )
}

export { AdminHeader }
