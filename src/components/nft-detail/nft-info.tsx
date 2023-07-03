import React from "react"
import { EditIcon, GlobeIcon, KeyIcon, LinkIcon, MoreVerticalIcon, ScrollIcon, TrashIcon } from "lucide-react"
import { Typography } from "@/components/ui/Typography"
import { AspectRatio } from "@/components/ui/AspectRatio"
import Image from "next/image"
import Link from "next/link"
import { Routes } from "@/config/routes"
import { NftDto } from "@/types/apis"
import { IconButton } from "@/components/ui/IconButton"
import { cn } from "@/utils/cn"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover"

export const NFTInfo = ({ nft }: { nft?: NftDto }) => {
  return (
    <div className="mx-auto max-w-xl">
      <div className="relative flex flex-col rounded-2xl bg-white shadow-card md:flex-row">
        <div className="w-full p-2 md:w-1/3 md:pr-0">
          <AspectRatio className="overflow-hidden rounded-xl">
            <Image fill alt={nft?.name ?? ""} src={nft?.image ?? ""} />
          </AspectRatio>
        </div>
        <div className="flex-1 px-6 py-4 md:py-6">
          <div className="flex flex-col gap-2">
            <Typography as="h5" level="body2" className="line-clamp-2 font-bold">
              {nft?.name}
            </Typography>
            <Typography level="body4" className="line-clamp-3">
              {nft?.description}
            </Typography>
          </div>
        </div>
        {nft && (
          <Actions
            nftId={nft.id}
            trigger={
              <IconButton size="sm" className="absolute bottom-4 right-4">
                <MoreVerticalIcon />
              </IconButton>
            }
          />
        )}
      </div>
      <div className="mt-10 rounded-2xl p-6 shadow-card">
        <Typography className="font-bold">Distribute your POAP</Typography>
        <div className="mt-5 flex flex-col gap-5">
          {nft && (
            <DropMethodItem
              name="Mint website"
              description="Share a webpage (link or QR code) where any visitor is able to mint the POAP"
              icon={<GlobeIcon className="h-8 w-8 text-success-500" />}
              href={Routes.NFT_DETAIL_MINT_WEBSITE(nft.id)}
              active
            />
          )}
          <DropMethodItem
            name="Whitelist"
            description="Share a webpage (link or QR code) where only whitelisted participants are able to mint the POAP"
            icon={<ScrollIcon className="h-8 w-8 text-info-500" />}
            href=""
            active={false}
          />
          <DropMethodItem
            name="Mint links"
            description="Share unique links for each individual participant."
            icon={<LinkIcon className="h-8 w-8 text-error-500" />}
            href=""
            active={false}
          />

          <DropMethodItem
            name="Secret"
            description="Share a secret passphrase that participants can use to mint the POAP."
            icon={<KeyIcon className="h-8 w-8 text-warning-500" />}
            href=""
            active={false}
          />
        </div>
      </div>
    </div>
  )
}

type DropMethodItemProps = {
  icon: React.ReactNode
  name: string
  description: string
  active: boolean
  href: string
}

const DropMethodItem = ({ href, icon, name, description, active }: DropMethodItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex gap-4 rounded-xl border border-gray-500/16 p-5 text-left transition-colors",
        { "cursor-not-allowed opacity-60": !active },
        { "hover:ring-2 hover:ring-gray-800": active }
      )}
      aria-disabled={!active}
    >
      {icon}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Typography as="h6" className="font-semibold">
            {name}
          </Typography>
          {!active && (
            <span className="flex h-6 min-w-[24px] items-center rounded-md bg-gray-500/16 px-1.5 text-xs font-semibold text-gray-700">
              Coming Soon
            </span>
          )}
        </div>
        <Typography color="secondary" level="body4">
          {description}
        </Typography>
      </div>
    </Link>
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
        <ul className="p-1">
          <Link href={Routes.NFT_DETAIL_EDIT(nftId)}>
            <li className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-500/8">
              <EditIcon className="h-4 w-4" />
              <Typography as="span" level="body4">
                Edit
              </Typography>
            </li>
          </Link>
          <li className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-2 py-1.5 text-error-500 hover:bg-gray-500/8">
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
