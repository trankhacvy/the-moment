import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY_NFT_DROPS = "NFT_DROPS"

export function useNFTDrops(nftId?: string) {
  const { data, ...rest } = useSWR(nftId ? [SWR_KEY_NFT_DROPS, nftId] : null, () => client.getNFTDrops(nftId!))

  return {
    drops: data?.data,
    ...rest,
  }
}
