import { Typography } from "@/components/ui/Typography"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Button } from "@/components/ui/Button"
import { IconButton } from "../ui/IconButton"
import { XIcon } from "lucide-react"
import { DropDto, NftDto } from "@/types/apis"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useToast } from "../ui/Toast"
import { client } from "@/libs/api"
import Link from "next/link"
import { useUserAuth } from "@/hooks/useUserAuth"

type EmailClaimModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  nftDrop: DropDto
}

export const EmailClaimModal = ({ trigger, isOpen = false, onOpenChange, nftDrop }: EmailClaimModalProps) => {
  const nft = nftDrop.nft as NftDto
  const { user } = useUserAuth(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const claim = async () => {
    try {
      setLoading(true)
      // const response = await client.claimNFTByEmail({
      //   dropId: nftDrop.id,
      //   email: 'session.user?.user.email',
      //   network: "devnet",
      // })
      setSuccess(true)
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false)
    }
  }, [isOpen])

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          <div className="flex flex-col items-center gap-5">
            <div className="w-40 overflow-hidden rounded-full">
              <AspectRatio>
                <Image fill alt={nft.name} className="rounded-2xl" src={nft.image} />
              </AspectRatio>
            </div>
            {!success && (
              <Typography className="text-center">
                Claim your NFT to your email <b>{user?.email}</b> by clicking the button below. You can withdraw the NFT
                to your wallet later without any fees or costs.
              </Typography>
            )}
          </div>
          <AlertDialogFooter>
            {success ? (
              <div className="flex w-full flex-col items-center justify-center gap-3">
                <Typography as="h6" level="h5" className="font-bold">
                  Congrats 🎉🎉
                </Typography>
                <Typography color="secondary">You've successfully claimed the NFT</Typography>
                {/* // TODO update URL */}
                {/* <Link className="text-gray-900 underline" href={`/claim/${nftDrop.suffix}/profile`}>
                  View in your profile
                </Link> */}
              </div>
            ) : (
              <Button loading={loading} scheme="default" onClick={claim} fullWidth>
                Claim
              </Button>
            )}
          </AlertDialogFooter>
          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 !shadow-none hover:bg-gray-800/8 focus:ring-0"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </IconButton>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
