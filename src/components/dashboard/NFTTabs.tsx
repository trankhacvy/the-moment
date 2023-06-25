import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAuthContext } from "@/libs/auth"
import { useNFTs } from "@/hooks/useNFTs"
import { NFTItem, NFTItemSkeleton } from "./NFTItem"

export const NFTTabs = () => {
  const { user } = useAuthContext()
  const { nfts, isLoading } = useNFTs(user?.id)

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6 w-full lg:mb-10">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 9 }).map((_, idx) => <NFTItemSkeleton key={idx} />)
            : nfts?.data.map((nft) => <NFTItem key={nft.id} nft={nft} />)}
        </div>
      </TabsContent>
      <TabsContent value="published">
        <WhiteList />
      </TabsContent>
      <TabsContent value="draft">
        <WhiteList />
      </TabsContent>
    </Tabs>
  )
}

const WhiteList = () => {
  return <div className="flex items-center justify-center p-6">No whitelist found</div>
}
