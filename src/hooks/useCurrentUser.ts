import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY_CURRENT_USER = "CURRENT_USER"

export const useCurrentUser = () => {
  return useSWR(SWR_KEY_CURRENT_USER, () => client.getCurrentUser(), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  })
}
