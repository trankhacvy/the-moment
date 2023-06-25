import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY = "/users/:id/nfts"

export function useNFTs(userId?: string) {
  const { data, ...rest } = useSWR(userId ? [SWR_KEY, userId] : null, () => client.getNFTs(userId!))

  return {
    nfts: data,
    ...rest,
  }
}
