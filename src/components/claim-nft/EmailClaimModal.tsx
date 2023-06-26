import { Typography } from "@/components/ui/Typography"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
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
import { useSession } from "next-auth/react"
import Link from "next/link"

type EmailClaimModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  nftDrop: DropDto
}

export const EmailClaimModal = ({ trigger, isOpen = false, onOpenChange, nftDrop }: EmailClaimModalProps) => {
  const nft = nftDrop.nft as NftDto
  const { data: session } = useSession()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState("")
  const { toast } = useToast()

  const claim = async () => {
    try {
      if (!session?.user?.user.email) return

      setLoading(true)
      const response = await client.claimNFTByEmail({
        dropId: nftDrop.id,
        email: session.user?.user.email,
        network: "devnet",
      })
      setSignature(response.signature ?? "")
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
          <AlertDialogDescription className="flex flex-col items-center gap-5">
            <div className="w-40 overflow-hidden rounded-full">
              <AspectRatio>
                <Image fill alt={nft.name} className="rounded-2xl" src={nft.image} />
              </AspectRatio>
            </div>
            {!success && (
              <Typography className="text-center text-gray-900">
                Click the button below to claim your NFT to your email : <b>{session?.user?.user.email}</b>.
                <br /> You will be able to withdraw the NFT
                <br /> to your wallet at a later time.
                <br /> No fees or costs are required.
              </Typography>
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            {success ? (
              <div className="flex w-full flex-col items-center justify-center">
                <Typography as="h6" className="font-bold" level="h6">
                  Congrats 🎉🎉
                </Typography>
                <Button as={Link} variant="link" href={`/claim/${nftDrop.suffix}/profile`}>
                  View in your profile
                </Button>
              </div>
            ) : (
              <Button loading={loading} onClick={claim} fullWidth>
                Claim
              </Button>
            )}
          </AlertDialogFooter>
          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 shadow-none hover:bg-gray-800/8"
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
