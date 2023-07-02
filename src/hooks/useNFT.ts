import { client } from "@/libs/api"
import { useSession } from "next-auth/react"
import useSWR, { Fetcher, Key } from "swr"

const SWR_KEY = "/nfts/:id"

export function useNFT(id?: string) {
  const { data, ...rest } = useSWR(id ? [SWR_KEY, id] : null, () => client.getNFT(id!))

  return {
    nft: data,
    ...rest,
  }
}
