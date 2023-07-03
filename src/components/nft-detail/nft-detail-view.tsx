import React from "react"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Skeleton } from "@/components/ui/Skeleton"
import { NftDto } from "@/types/apis"
import { NFTDetailTabs } from "./nft-detail-tabs"
import { NFTInfo } from "./nft-info"

type Props = {
  nft?: NftDto
}

export const NFTDetail = ({ nft }: Props) => {
  const drops = nft?.drops ?? []

  return drops.length > 0 ? <NFTDetailTabs nft={nft} /> : <NFTInfo nft={nft} />
}

export const NFTDetailSkeleton = () => {
  return (
    <div className="flex gap-6">
      <div className="basis-1/2">
        <AspectRatio>
          <Skeleton className="h-full w-full rounded-2xl" />
        </AspectRatio>
      </div>
      <div className="basis-1/2 space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
