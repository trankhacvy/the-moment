import { useRouter } from "next/router"
import { useEffect } from "react"
import { useCurrentUser } from "./useCurrentUser"

export const useUser = ({ redirectTo = "", redirectIfFound = false } = {}) => {
  const { data, isLoading, error, mutate } = useCurrentUser()
  const { push } = useRouter()

  const user = error ? undefined : data

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      push(redirectTo)
      return
    }
  }, [user, redirectIfFound, redirectTo, push])

  return {
    isUsrLoading: isLoading,
    user,
    mutateUser: mutate,
    userError: error,
  }
}
