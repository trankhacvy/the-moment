import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ClaimedNFTs } from "./ClaimedNFTs"

export const ProfileTabs = () => {
  return (
    <Tabs defaultValue="claimed" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="claimed">Claimed</TabsTrigger>
        <TabsTrigger value="claimable">Claimable</TabsTrigger>
      </TabsList>
      <TabsContent value="claimed">
        <ClaimedNFTs />
      </TabsContent>
      <TabsContent value="claimable">
        <ClaimedNFTs />
      </TabsContent>
    </Tabs>
  )
}
