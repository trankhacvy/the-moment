import { Database } from "@/types/supabase.types"

type NftTabProps = {
  eventDropId: string
  nft?: Database["public"]["Tables"]["poap_nfts"]["Row"]
}

export const NftTab = ({ nft, eventDropId }: NftTabProps) => {
  return <div>nft</div>
}
