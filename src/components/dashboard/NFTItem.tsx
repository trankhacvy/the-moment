import Link from "next/link"
import { AspectRatio } from "../ui/AspectRatio"
import { Typography } from "../ui/Typography"
import { Routes } from "@/config/routes"
import { Skeleton } from "../ui/Skeleton"
import { NftDto } from "@/types/apis"
import BlurImage from "../ui/BlurImage"

type NFTItemProps = {
  nft: NftDto
}

export const NFTItem = ({ nft }: NFTItemProps) => {
  return (
    <Link href={Routes.NFT_DETAIL(nft.id)}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <AspectRatio>
          <BlurImage src={nft.image} alt={nft.name} fill />
        </AspectRatio>
        <div className="p-5">
          <Typography className="font-semibold">{nft.name}</Typography>
        </div>
      </div>
    </Link>
  )
}

export const NFTItemSkeleton = () => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-card">
    <AspectRatio>
      <Skeleton className="h-full w-full" />
    </AspectRatio>
    <div className="p-5">
      <Skeleton className="mb-2 h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)
