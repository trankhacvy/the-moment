import React from "react"
import { NftDto } from "@/types/apis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { NFTInfo } from "./nft-info"
import { DropList } from "./drop-list"

type NFTDetailTabsProps = {
  nft?: NftDto
}

export const NFTDetailTabs = ({ nft }: NFTDetailTabsProps) => {
  return (
    <Tabs defaultValue="nfts" className="w-full">
      <TabsList className="mb-6 w-full lg:mb-10">
        <TabsTrigger value="nfts">NFTs</TabsTrigger>
        <TabsTrigger value="drops">Drops</TabsTrigger>
      </TabsList>
      <TabsContent value="nfts">
        <NFTInfo nft={nft} />
      </TabsContent>
      <TabsContent value="drops">
        <DropList nft={nft} />
      </TabsContent>
    </Tabs>
  )
}
