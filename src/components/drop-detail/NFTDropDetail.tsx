import { GlobeIcon, KeyIcon, LinkIcon, ScrollIcon } from "lucide-react"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/ui/Typography"
import { NFTDrop, NFTMetadata } from "@/types/schema"
import { AspectRatio } from "../ui/AspectRatio"
import Image from "next/image"
import { CreateWebsiteDropModal } from "./CreateWebsiteDropModal"

type Props = {
  nft?: NFTMetadata
}

const NFTDropDetail = ({ nft }: Props) => {
  return (
    <div className="flex gap-10">
      <div className="shrink-0 basis-1/3">
        <AspectRatio className="overflow-hidden rounded-2xl">
          <Image fill alt={nft?.name ?? ""} src={nft?.image ?? ""} />
        </AspectRatio>
      </div>
      <div className="basic-2/3">
        {/* <span
          className={cn("h-6 min-w-[24px] rounded-md px-1 font-bold lowercase", {
            "bg-gray-500/16 text-gray-600": nftDrop?.status === "DRAFT",
            "bg-info-500/16 text-info-600": nftDrop?.status === "ACTIVE",
          })}
        >
          <Typography level="body4">{nftDrop?.status}</Typography>
        </span> */}
        <Typography as="h5" level="body2" className="mt-4 font-bold">
          {nft?.name}
        </Typography>
        <Typography color="secondary" level="body4" className="mt-4">
          {nft?.description}
        </Typography>
        <div className="mt-10">
          <Typography className="font-semibold">Distribute your POAP</Typography>
          <div className="mt-5 grid grid-cols-2 gap-6">
            {nft && (
              <CreateWebsiteDropModal
                nft={nft}
                trigger={
                  <button className="rounded-2xl p-5 text-left shadow-card hover:shadow-dropdown">
                    <GlobeIcon className="h-6 w-6 text-info-500" />
                    <Typography as="h6" className="mt-2 font-bold">
                      Mint website
                    </Typography>
                    <Typography color="secondary" level="body4" className="mt-2">
                      Share a webpage (link or QR code) where any visitor is able to mint the POAP
                    </Typography>
                  </button>
                }
              />
            )}
            <button className="rounded-2xl p-5 text-left opacity-80 shadow-card disabled:cursor-not-allowed" disabled>
              <ScrollIcon className="h-6 w-6 text-success-500" />
              <Typography as="h6" className="mt-2 font-bold">
                Whitelist
              </Typography>
              <Typography color="secondary" level="body4" className="mt-2">
                Share a webpage (link or QR code) where only whitelisted participants are able to mint the POAP
              </Typography>
            </button>

            <button className="rounded-2xl p-5 text-left opacity-80 shadow-card disabled:cursor-not-allowed" disabled>
              <LinkIcon className="h-6 w-6 text-warning-500" />
              <Typography as="h6" className="mt-2 font-bold">
                Mint links
              </Typography>
              <Typography color="secondary" level="body4" className="mt-2">
                Share unique links for each individual participant.
              </Typography>
            </button>

            <button className="rounded-2xl p-5 text-left opacity-80 shadow-card disabled:cursor-not-allowed" disabled>
              <KeyIcon className="h-6 w-6 text-warning-500" />
              <Typography as="h6" className="mt-2 font-bold">
                Secret
              </Typography>
              <Typography color="secondary" level="body4" className="mt-2">
                Share a secret passphrase that participants can use to mint the POAP.
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { NFTDropDetail }
