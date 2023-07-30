import React, { useState } from "react"
import { Typography } from "@/components/ui/Typography"
import { DropDto } from "@/types/apis"
import { Badge } from "../ui/badge"
import dayjs from "dayjs"
import { IconButton } from "../ui/IconButton"
import { DownloadIcon, EditIcon, EyeIcon, GlobeIcon, MoreVerticalIcon, QrCodeIcon, TrashIcon } from "lucide-react"
import { CreateWebsiteDropSheet } from "../CreateWebsiteDropSheet"
import { getLabelByStatus } from "@/utils/drop"
import { WebsiteDropDetailSheet } from "../WebsiteDropDetailSheet"
import { DropMethodItem } from "./DropMethodItem"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { Button } from "../ui/Button"
import { client } from "@/libs/api"
import { useToast } from "../ui/Toast"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog"
import { AspectRatio } from "../ui/AspectRatio"
import Image from "next/image"
import { KeyedMutator } from "swr"
import { BaseListResponse } from "@/types/schema"
import { getQRCode } from "@/utils/qrcode"
import { APP_BASE_URL } from "@/config/env"

type WebsiteDropProps = {
  drop?: DropDto
  nftId: string
  mutate: KeyedMutator<BaseListResponse<DropDto>>
}

export const WebsiteDrop = ({ drop, nftId, mutate }: WebsiteDropProps) => {
  const [isRepaying, setIsRepaying] = useState(false)
  const { toast } = useToast()

  if (!drop) {
    return (
      <CreateWebsiteDropSheet
        nftId={nftId}
        onSuccess={mutate}
        trigger={
          <DropMethodItem
            name="Mint website"
            description="Share a webpage (link or QR code) where any visitor is able to mint the NFT"
            icon={<GlobeIcon className="h-8 w-8 mt-2 text-success-500" />}
            active
          />
        }
      />
    )
  }

  const label = getLabelByStatus(drop.status)

  const handleRepay = async () => {
    try {
      setIsRepaying(true)
      await client.repayDrop(drop.id, "https://google.com")
      toast({
        variant: "success",
        title: "Success",
        description: "Congratulations, you've repaid successfully. 🎉",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message?.toString() || "Unknown error",
      })
    } finally {
      setIsRepaying(false)
    }
  }

  return (
    <div className="flex gap-4 rounded-2xl bg-white shadow-card p-5 text-left transition-colors">
      <GlobeIcon className="h-8 w-8 mt-2 text-success-500" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2 flex-1">
            <Typography as="h6" className="font-semibold">
              Website drop
            </Typography>
            <Badge variant={label.variant}>{label.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {drop.status === "ACTIVE" && (
              <WebsiteDropDetailSheet
                dropId={drop.id}
                trigger={
                  <IconButton size="sm">
                    <EyeIcon />
                  </IconButton>
                }
              />
            )}

            <Actions
              nftId={nftId}
              drop={drop}
              mutate={mutate}
              trigger={
                <IconButton size="sm">
                  <MoreVerticalIcon />
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
              {dayjs(drop?.websiteDrop.startAt).format("DD/MM/YYYY hh:mm")}
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography color="secondary" level="body4">
              End at
            </Typography>
            <Typography className="font-semibold" level="body4">
              {dayjs(drop?.websiteDrop.endAt).format("DD/MM/YYYY hh:mm")}
            </Typography>
          </div>
        </div>
        {drop.status === "PAYMENT_FAILED" && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleRepay} loading={isRepaying} size="sm">
              Repay
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

type ActionsProps = {
  trigger: React.ReactNode
  nftId: string
  drop: DropDto
  mutate: KeyedMutator<BaseListResponse<DropDto>>
}

const Actions = ({ nftId, drop, trigger, mutate }: ActionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-0">
        <ul className="p-2">
          <CreateWebsiteDropSheet
            nftId={nftId}
            drop={drop}
            onSuccess={mutate}
            trigger={
              <li className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-500/8">
                <EditIcon className="h-4 w-4" />
                <Typography as="span" level="body4">
                  Edit
                </Typography>
              </li>
            }
          />

          {drop.status === "ACTIVE" && (
            <WebsiteQRCode
              url={`${APP_BASE_URL}/claim/${drop.websiteDrop.slug}`}
              trigger={
                <li className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-500/8">
                  <QrCodeIcon className="h-4 w-4" />
                  <Typography as="span" level="body4">
                    QR Code
                  </Typography>
                </li>
              }
            />
          )}

          {drop.status === "ACTIVE" && (
            <SolanaPayQRCode
              trigger={
                <li className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-500/8">
                  <QrCodeIcon className="h-4 w-4" />
                  <Typography as="span" level="body4">
                    Solana Pay QR Code
                  </Typography>
                </li>
              }
            />
          )}

          {drop.status === "WAITING_FOR_PAYMENT" && (
            <DeleteDialog
              dropId={drop.id}
              onSuccess={mutate}
              trigger={
                <li className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-error-500 hover:bg-gray-500/8">
                  <TrashIcon className="h-4 w-4" />
                  <Typography as="span" level="body4">
                    Delete
                  </Typography>
                </li>
              }
            />
          )}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

type WebsiteQRCodeProps = {
  trigger: React.ReactNode
  url: string
}

const WebsiteQRCode = ({ trigger, url }: WebsiteQRCodeProps) => {
  const qrCodeUri = getQRCode(url)

  const handleDownload = () => {
    if (!qrCodeUri) return

    const elm = document.createElement("a")
    elm.href = qrCodeUri
    elm.download = `${new Date().getTime()}`
    elm.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Website QR Code</DialogTitle>
          <DialogDescription>
            Show this QR code to the participant so they can scan it and be redirected to the website to claim the NFT.
          </DialogDescription>
        </DialogHeader>
        <AspectRatio>{qrCodeUri && <Image className="rounded-2xl" fill src={qrCodeUri} alt="logo" />}</AspectRatio>

        <DialogFooter>
          <Button onClick={handleDownload} fullWidth startDecorator={<DownloadIcon />}>
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type SolanaPayQRCodeProps = {
  trigger: React.ReactNode
}

const SolanaPayQRCode = ({ trigger }: SolanaPayQRCodeProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solana Pay QR Code</DialogTitle>
          <DialogDescription>
            Show this QR code to the participant so they can scan it and be redirected to the website to claim the NFT.
          </DialogDescription>
        </DialogHeader>
        <AspectRatio>
          <Image fill src={"/assets/logo.png"} alt="logo" />
        </AspectRatio>

        <DialogFooter>
          <Button fullWidth startDecorator={<DownloadIcon />}>
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type DeleteDialogProps = {
  dropId: string
  trigger: React.ReactNode
  onSuccess?: VoidFunction
}

const DeleteDialog = ({ dropId, trigger, onSuccess }: DeleteDialogProps) => {
  const [loading, setIsLoading] = useState(false)
  const [open, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await client.deleteDrop(dropId)
      console.log("delete ok")
      setIsOpen(false)
      toast({
        variant: "success",
        title: "Success",
        description: "Your drop has been successfully deleted.",
      })
      onSuccess?.()
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message?.toString() || "Server error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-0">
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription className="text-gray-900">Are you sure you want delete this drop?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <Button onClick={handleDelete} loading={loading} color="error">
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
