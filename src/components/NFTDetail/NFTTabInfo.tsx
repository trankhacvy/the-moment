import React from "react"
import { Typography } from "@/components/ui/Typography"
import { NftDto } from "@/types/apis"
import { WebsiteDrop } from "./WebsiteDrop"
import { NFTCard } from "./NFTCard"
import { useNFTDrops } from "@/hooks/useNFTDrops"
import { Skeleton } from "../ui/Skeleton"
// import { MintLinksDrop } from "./MintLinksDrop"
// import { SecretDrop } from "./SecretDrop"
// import { WhitelistDrop } from "./WhitelistDrop"

export const NFTTabInfo = ({ nft }: { nft: NftDto }) => {
  const { data, isLoading, mutate } = useNFTDrops(nft.id)

  const websiteDrop = data?.data?.find((drop) => drop.method === "WEBSITE")

  return (
    <div className="flex flex-col md:flex-row flex-wrap -mx-4">
      <NFTCard nft={nft} />

      {isLoading ? (
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
      ) : (
        <div className="w-full md:w-2/3 px-4 mt-4 md:mt-0">
          <Typography as="h6" level="body2" className="font-bold">
            Distribute your NFT
          </Typography>
          <div className="mt-5 flex flex-col gap-5">
            <WebsiteDrop nftId={nft.id} drop={websiteDrop} mutate={mutate} />
            {/* <MintLinksDrop nftId={nft.id} drop={mintLinksDrop} />
          <SecretDrop nftId={nft.id} drop={secretDrop} />
          <WhitelistDrop nftId={nft.id} drop={whitelistDrop} /> */}
          </div>
        </div>
      )}
    </div>
  )
}
