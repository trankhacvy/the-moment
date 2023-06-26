import { useNFTs } from "@/hooks/useNFTs"
import { NFTItem, NFTItemSkeleton } from "./NFTItem"
import { useSession } from "next-auth/react"

export type NFTListProps = {}

export const NFTList = () => {
  const { data: session } = useSession()
  const { nfts, isLoading } = useNFTs(session?.user?.user.id)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 9 }).map((_, idx) => <NFTItemSkeleton key={idx} />)
        : nfts?.data.map((nft) => <NFTItem key={nft.id} nft={nft} />)}
    </div>
  )
}
