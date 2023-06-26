import { API_BASE_URL } from "@/config/env"
import fetcher from "@/libs/fetcher"
import { useSession } from "next-auth/react"
import useSWR, { Key } from "swr"

export const useGet = <T, E>(key: Key, config?: any) => {
  const { data: session } = useSession()

  return useSWR<T, E>(
    key,
    (url) =>
      fetcher<T>(`${API_BASE_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token.accessToken}`,
        },
      }),
    config
  )
}

export const usePost = <T, E>(key: Key, body?: Record<string, any>, config?: any) => {
  const { data: session } = useSession()

  return useSWR<T, E>(
    key,
    (url) =>
      fetcher<T>(`${API_BASE_URL}${url}`, {
        method: "POST",
        body: JSON.stringify(body ?? {}),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token.accessToken}`,
        },
      }),
    config
  )
}
