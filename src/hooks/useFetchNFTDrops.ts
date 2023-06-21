import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY = "/nft-drops"

export function useNFTDrops(userId?: string) {
  const { data, ...rest } = useSWR(userId ? [SWR_KEY, userId] : null, () => client.getNFTDrops(userId!))

  return {
    nftDrops: data,
    ...rest,
  }
}
