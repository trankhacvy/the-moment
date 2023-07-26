import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY = "/nfts/:id/drops"

export function useNFTDrops(nftId: string) {
  const { data, ...rest } = useSWR([SWR_KEY, nftId], () => client.getNFTDrops(nftId))

  return {
    data,
    ...rest,
  }
}
