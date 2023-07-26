import { client } from "@/libs/api"
import useSWR, { SWRConfiguration } from "swr"

const SWR_KEY_NFT_DROP = "NFT_DROP"

export function useDrop(dropId?: string, config?: SWRConfiguration) {
  const { data, ...rest } = useSWR(dropId ? [SWR_KEY_NFT_DROP, dropId] : null, () => client.getDrop(dropId!), config)

  return {
    drop: data,
    ...rest,
  }
}
