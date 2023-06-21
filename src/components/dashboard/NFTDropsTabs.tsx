import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
// import { useNFTDrops } from "@/hooks/useFetchNFTDrops"
import { useAuthContext } from "@/libs/auth"
import { NFTDrop, NFTMetadata } from "@/types/schema"
import Link from "next/link"
import { AspectRatio } from "../ui/AspectRatio"
import Image from "next/image"
import { Typography } from "../ui/Typography"
// import { cn } from "@/utils/cn"
// import { ClockIcon, ImageIcon } from "lucide-react"
import dayjs from "dayjs"
import { Routes } from "@/config/routes"
import { useNFTs } from "@/hooks/useNFTs"

export const NFTDropsTabs = () => {
  const { user } = useAuthContext()
  const { nfts, isLoading } = useNFTs(user?.id)

  if (isLoading) {
    return <div className="">loading...</div>
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6 w-full lg:mb-10">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="grid grid-cols-3 gap-6">
          {nfts?.data.map((nft) => (
            <NFTItem key={nft.id} nft={nft} />
          ))}
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

type DropItemProps = {
  nft: NFTMetadata
}

const NFTItem = ({ nft }: DropItemProps) => {
  return (
    <Link href={Routes.NFT_DROP_DETAIL(nft.id)}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <AspectRatio>
          <Image src={nft.image} alt={nft.name} fill />
        </AspectRatio>
        <div className="p-5">
          {/* <div className="mb-2 flex justify-between">
            <span
              className={cn("h-6 min-w-[24px] rounded-md px-1 font-bold lowercase", {
                "bg-gray-500/16 text-gray-600": nftDrop.status === "DRAFT",
                "bg-info-500/16 text-info-600": nftDrop.status === "ACTIVE",
              })}
            >
              <Typography level="body4">{nftDrop.status}</Typography>
            </span>
          </div> */}
          <Typography className="mb-2 font-semibold">{nft.name}</Typography>
          <Typography color="secondary" level="body4" className="line-clamp-2 text-ellipsis">
            {nft.description}
          </Typography>
          {/* <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-info-500" />
              <Typography level="body4">{nftDrop.amount} NFTs</Typography>
            </div> */}
          {/* <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-info-500" />
              <Typography level="body4">Start At: {dayjs(nftDrop.startAt).format("DD/MM/YYYY HH:MM")}</Typography>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-info-500" />
              <Typography level="body4">End At: {dayjs(nftDrop.endAt).format("DD/MM/YYYY HH:MM")}</Typography>
            </div>
          </div> */}
        </div>
      </div>
    </Link>
  )
}
