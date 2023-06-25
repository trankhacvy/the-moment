import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY = "/claims/:email"

export function useGetClaimsByEmail(email?: string) {
  const { data, ...rest } = useSWR(email ? [SWR_KEY, email] : null, () => client.getClaimsByEmail(email ?? ""))

  return {
    claims: data,
    ...rest,
  }
}
