import React from "react"
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"
import { Typography } from "@/components/ui/Typography"
import { AspectRatio } from "@/components/ui/AspectRatio"
import Link from "next/link"
import { Routes } from "@/config/routes"
import { NftDto } from "@/types/apis"
import { IconButton } from "@/components/ui/IconButton"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover"
import BlurImage from "../ui/BlurImage"
import { placeholderBlurhash } from "@/utils/image"
import { Badge } from "../ui/badge"

export const NFTCard = ({ nft }: { nft?: NftDto }) => {
  return (
    <div className="w-full md:w-1/3 px-4">
      <div className="rounded-2xl bg-white shadow-card">
        <AspectRatio className="m-4">
          <BlurImage
            className="rounded-xl"
            fill
            alt={nft?.name ?? ""}
            src={nft?.image ?? ""}
            blurDataURL={placeholderBlurhash}
          />
        </AspectRatio>
        <div className="flex-1 px-4 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline gap-2">
              <Typography as="h5" level="body2" className="line-clamp-2 font-bold">
                {nft?.name}
              </Typography>
              {nft && (
                <Actions
                  nftId={nft.id}
                  trigger={
                    <IconButton size="sm" className="!shrink-0">
                      <MoreVerticalIcon />
                    </IconButton>
                  }
                />
              )}
            </div>
            <Typography level="body4" className="line-clamp-3">
              {nft?.description}
            </Typography>
          </div>
          <div className="grid grid-cols-3 mt-6 gap-4">
            <Typography color="secondary" level="body4">
              Symbol
            </Typography>
            <Typography className="col-span-2 text-right font-semibold" level="body4">
              {nft?.symbol}
            </Typography>
            <Typography color="secondary" level="body4">
              External URL
            </Typography>
            <Typography className="col-span-2 text-right font-semibold" level="body4">
              {nft?.externalUrl}
            </Typography>
            <Typography color="secondary" level="body4">
              Attributes
            </Typography>
            <div className="flex gap-1 justify-end col-span-2">
              {nft?.attributes?.map((item) => <Badge>{`${item.traitType}: ${item.value}`}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ActionsProps = {
  trigger: React.ReactNode
  nftId: string
}

const Actions = ({ trigger, nftId }: ActionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-0">
        <ul className="p-2">
          <Link href={Routes.NFT_DETAIL_EDIT(nftId)}>
            <li className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-500/8">
              <EditIcon className="h-4 w-4" />
              <Typography as="span" level="body4">
                Edit
              </Typography>
            </li>
          </Link>
          {/* // TODO implement it */}
          <li className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2 text-error-500 hover:bg-gray-500/8">
            <TrashIcon className="h-4 w-4" />
            <Typography as="span" level="body4">
              Delete
            </Typography>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
