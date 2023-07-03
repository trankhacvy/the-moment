import { useNFTs } from "@/hooks/useNFTs"
import { NFTItem, NFTItemSkeleton } from "./NFTItem"
import { useUser } from "@/hooks/use-user"
import { DatabaseIcon } from "lucide-react"
import { Typography } from "../ui/Typography"

export type NFTListProps = {}

export const NFTList = () => {
  const { user } = useUser()
  const { nfts, isLoading } = useNFTs(user?.id)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <NFTItemSkeleton key={idx} />
        ))}
      </div>
    )
  }

  if (nfts?.data.length === 0) {
    return (
      <div className="flex flex-col items-center py-10">
        <DatabaseIcon className="h-24 w-24 text-gray-500" />
        <Typography color="secondary" className="mt-5 font-semibold">
          No data
        </Typography>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 9 }).map((_, idx) => <NFTItemSkeleton key={idx} />)
        : nfts?.data.map((nft) => <NFTItem key={nft.id} nft={nft} />)}
    </div>
  )
}
