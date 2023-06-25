import Link from "next/link"
import { AspectRatio } from "../ui/AspectRatio"
import Image from "next/image"
import { Typography } from "../ui/Typography"
import { Routes } from "@/config/routes"
import { Skeleton } from "../ui/Skeleton"
import { NftDto } from "@/types/apis"

type NFTItemProps = {
  nft: NftDto
}

export const NFTItem = ({ nft }: NFTItemProps) => {
  return (
    <Link href={Routes.NFT_DETAIL(nft.id)}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <AspectRatio>
          <Image src={nft.image} alt={nft.name} fill />
        </AspectRatio>
        <div className="p-5">
          <Typography className="mb-2 font-semibold">{nft.name}</Typography>
          <Typography color="secondary" level="body4" className="line-clamp-2 text-ellipsis">
            {nft.description}
          </Typography>
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
