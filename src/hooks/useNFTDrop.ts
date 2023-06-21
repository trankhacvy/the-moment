import { client } from "@/libs/api"
import useSWR from "swr"

const SWR_KEY = "/nft-drops/:id"

export function useNFTDrop(id?: string) {
  const { data, ...rest } = useSWR(id ? [SWR_KEY, id] : null, () => client.getNFTDrop(id!))

  return {
    nftDrop: data,
    ...rest,
  }
}
