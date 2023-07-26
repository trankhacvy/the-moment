import React from "react"
import { Typography } from "@/components/ui/Typography"
import { cn } from "@/utils/cn"
import { DropDto } from "@/types/apis"
import { Badge } from "../ui/badge"
import dayjs from "dayjs"
import { IconButton } from "../ui/IconButton"
import { EditIcon, EyeIcon, GlobeIcon, KeyIcon, LinkIcon } from "lucide-react"
import { CreateWebsiteDropSheet } from "../CreateWebsiteDropSheet"
import { getLabelByStatus } from "@/utils/drop"
import { WebsiteDropDetailSheet } from "../WebsiteDropDetailSheet"
import { DropMethodItem } from "./DropMethodItem"

type SecretDropProps = {
  drop?: DropDto
  nftId: string
}

export const SecretDrop = ({ drop, nftId }: SecretDropProps) => {
  if (!drop) {
    return (
      <CreateWebsiteDropSheet
        nftId={nftId}
        trigger={
          <DropMethodItem
            name="Secret"
            description="Share a secret passphrase that participants can use to mint the POAP."
            icon={<KeyIcon className="h-8 w-8 text-warning-500" />}
            active={false}
          />
        }
      />
    )
  }

  const label = getLabelByStatus(drop.status)
  return (
    <button
      className={cn(
        "flex gap-4 rounded-2xl bg-white shadow-card bborder bborder-gray-500/16 p-5 text-left transition-colors hover:ring-2 hover:ring-gray-800"
      )}
    >
      <GlobeIcon className="h-8 w-8 mt-2 text-success-500" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Typography as="h6" className="font-semibold">
              Website drop
            </Typography>
            <Badge variant={label.variant}>{label.label}</Badge>
          </div>
          <div className="flex gap-1">
            <CreateWebsiteDropSheet
              nftId={nftId}
              drop={drop}
              trigger={
                <IconButton size="sm">
                  <EditIcon />
                </IconButton>
              }
            />

            <WebsiteDropDetailSheet
              dropId={drop.id}
              trigger={
                <IconButton size="sm">
                  <EyeIcon />
                </IconButton>
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Typography color="secondary" level="body4">
              Amount
            </Typography>
            <Typography className="font-semibold" level="body4">
              {drop?.requestedAmount}
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography color="secondary" level="body4">
              URL
            </Typography>
            <Typography className="font-semibold" level="body4">
              {drop?.websiteDrop.slug}
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography color="secondary" level="body4">
              Start at
            </Typography>
            <Typography className="font-semibold" level="body4">
              {dayjs(drop?.websiteDrop.startAt).format("DD/MM/YYYY")}
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography color="secondary" level="body4">
              End at
            </Typography>
            <Typography className="font-semibold" level="body4">
              {dayjs(drop?.websiteDrop.endAt).format("DD/MM/YYYY")}
            </Typography>
          </div>
        </div>
      </div>
    </button>
  )
}
