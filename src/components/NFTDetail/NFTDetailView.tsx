import React from "react"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Skeleton } from "@/components/ui/Skeleton"
import { NftDto } from "@/types/apis"
import { NFTTabInfo } from "./NFTTabInfo"

type Props = {
  nft?: NftDto
}

export const NFTDetailView = ({ nft }: Props) => {
  if (!nft) return null

  return <NFTTabInfo nft={nft} />
}

export const NFTDetailSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap -mx-4">
      <div className="w-full lg:w-1/3 px-4">
        <div className="rounded-2xl bg-white shadow-card">
          <AspectRatio className="m-4">
            <Skeleton className="w-full h-full" />
          </AspectRatio>
          <div className="flex-1 px-4 pb-6">
            <Skeleton className="w-1/2 h-5 rounded-md" />
            <Skeleton className="w-2/3 h-4 rounded-md mt-2" />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 px-4 mt-4 lg:mt-0 space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-card flex flex-col gap-3">
          <Skeleton className="w-1/2 h-5 rounded-md" />
          <Skeleton className="w-2/3 h-5 rounded-md" />
          <Skeleton className="w-full h-5 rounded-md" />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card flex flex-col gap-3">
          <Skeleton className="w-1/2 h-5 rounded-md" />
          <Skeleton className="w-2/3 h-5 rounded-md" />
          <Skeleton className="w-full h-5 rounded-md" />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card flex flex-col gap-3">
          <Skeleton className="w-1/2 h-5 rounded-md" />
          <Skeleton className="w-2/3 h-5 rounded-md" />
          <Skeleton className="w-full h-5 rounded-md" />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card flex flex-col gap-3">
          <Skeleton className="w-1/2 h-5 rounded-md" />
          <Skeleton className="w-2/3 h-5 rounded-md" />
          <Skeleton className="w-full h-5 rounded-md" />
        </div>
      </div>
    </div>
  )
}
