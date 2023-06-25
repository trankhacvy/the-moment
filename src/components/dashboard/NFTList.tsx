import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useNFTs } from "@/hooks/useNFTs"
import { useAuthContext } from "@/libs/auth"
import { NFTItem, NFTItemSkeleton } from "./NFTItem"

type NFTListProps = {}

export const NFTList = (props: NFTListProps) => {
  const { user } = useAuthContext()
  const { nfts, isLoading } = useNFTs(user?.id)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 9 }).map((_, idx) => <NFTItemSkeleton key={idx} />)
        : nfts?.data.map((nft) => <NFTItem key={nft.id} nft={nft} />)}
    </div>
  )
}
