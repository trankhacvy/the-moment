import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { EventDistribution } from "./EventDistribution"
import useSWR from "swr"
import { NftTab } from "./NftTab"
import { Supabase } from "@/libs/supabase"
import { ParticipantsTab } from "./ParticipantsTab"

type EventDetailTabsProps = {
  eventId: string
  dropId: string
  name: string
}

export const EventDetailTabs = ({ eventId, dropId }: EventDetailTabsProps) => {
  const { data: eventDrop, isLoading } = useSWR(
    ["event_drop", dropId],
    async () => {
      const { data, error } = await Supabase.from("poap_event_drops")
        .select("*,poap_nfts(*)")
        .eq("id", dropId)
        .maybeSingle()
      if (error) throw error
      return data
    },
    {}
  )

  const nft = eventDrop?.poap_nfts?.[0]

  if (isLoading) return <div>loading...</div>

  return (
    <div className="mt-10 flex gap-6 rounded-xl shadow-card">
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="nft">NFT</TabsTrigger>
        </TabsList>
        <TabsContent value="participants">
          <ParticipantsTab eventDropId={eventDrop?.id} />
        </TabsContent>
        <TabsContent value="whitelist">
          <WhiteList />
        </TabsContent>
        <TabsContent value="distribution">
          <EventDistribution eventId={eventId} />
        </TabsContent>
        <TabsContent value="nft">{eventDrop && <NftTab eventDropId={eventDrop.id} nft={nft} />}</TabsContent>
      </Tabs>
    </div>
  )
}

const WhiteList = () => {
  return <div className="flex items-center justify-center p-6">No whitelist found</div>
}
