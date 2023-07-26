import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useCurrentUser } from "./useCurrentUser"
import { Routes } from "@/config/routes"

export const useUserAuth = (authRoute: "sign-in" | "dashboard" | null = "dashboard") => {
  const { push, query } = useRouter()
  const { nextUrl } = query as { nextUrl: string }

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
          if (nextUrl) push(nextUrl)
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
      } else {
      }
    }
  }, [isLoading, user, error, isRouteAccess, authRoute, nextUrl])

  return {
    isLoading: isRouteAccess,
    user: error ? undefined : user,
    isLoggedIn: !error && user,
    mutateUser: mutate,
  }
}
