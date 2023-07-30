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
import { useWallet } from "@solana/wallet-adapter-react"
import { getTransactionUrl } from "@/utils/explorer"

type WalletClaimModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  drop: DropDto
}

export const WalletClaimModal = ({ trigger, isOpen = false, onOpenChange, drop }: WalletClaimModalProps) => {
  const nft = drop.nft as NftDto

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState("")
  const { toast } = useToast()
  const { publicKey } = useWallet()

  const claim = async () => {
    try {
      if (!publicKey) return
      setLoading(true)
      const response = await client.claimNFTByWallet({
        dropId: drop.id,
        claimant: publicKey.toBase58(),
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
          <div className="flex flex-col items-center gap-5">
            <div className="w-[240px] overflow-hidden rounded-full">
              <AspectRatio>
                <Image fill alt={nft.name} className="rounded-2xl" src={nft.image} />
              </AspectRatio>
            </div>
            {!success && (
              <Typography className="text-center text-gray-800">
                Click the below button to receive NFT.
                <br /> No fees or costs are required.
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
                <a className="text-gray-900 underline" target="_blank" href={getTransactionUrl(signature)}>
                  View transaction
                </a>
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
