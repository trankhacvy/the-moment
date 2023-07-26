import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useCurrentUser } from "./useCurrentUser"
import { Routes } from "@/config/routes"

export const useUserAuth = (authRoute: "sign-in" | "dashboard" | null = "dashboard") => {
  const { push, query } = useRouter()
  const { next_url } = query as { next_url: string }

  const [isRouteAccess, setIsRouteAccess] = useState(true)

  const { data: user, isLoading, error, mutate } = useCurrentUser()

  useEffect(() => {
    if (authRoute === null) {
      setIsRouteAccess(false)
      return
    } else {
      if (!isLoading) {
        setIsRouteAccess(true)
        if (user) {
          if (next_url) push(next_url)
          else {
            if (authRoute === "sign-in") {
              push(Routes.DASHBOARD)
              return
            }
            setIsRouteAccess(false)
            return
          }
        } else {
          if (authRoute === "sign-in") {
            setIsRouteAccess(false)
            return
          } else {
            push(Routes.INDEX)
            return
          }
        }
      }
    }
  }, [isLoading, user, error, isRouteAccess, authRoute, next_url])

  return {
    isLoading: isRouteAccess,
    user: error ? undefined : user,
    isLoggedIn: !error && user,
    mutateUser: mutate,
  }
}
