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
import { useState } from "react"
import { useToast } from "../ui/Toast"
import { client } from "@/libs/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSession } from "next-auth/react"

type WithdrawNFTModalProps = {
  trigger: React.ReactNode
  nftDrop: DropDto
  onSuccess?: VoidFunction
}

export const WithdrawNFTModal = ({ trigger, nftDrop, onSuccess }: WithdrawNFTModalProps) => {
  const nft = nftDrop.nft as NftDto
  const { data: session } = useSession()
  const { publicKey } = useWallet()

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("")
  const { toast } = useToast()

  const claim = async () => {
    try {
      if (!publicKey) return
      setLoading(true)
      const response = await client.withdrawNFT({
        email: session?.user?.user.email ?? "",
        claimant: publicKey.toBase58() ?? "",
        dropId: nftDrop.id,
        network: "devnet",
      })
      setSuccess(true)
      setAddress(response.nftAddress)
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    } finally {
      setLoading(false)
      onSuccess?.()
    }
  }

  return (
    <>
      <AlertDialog>
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
                Click the below button to receive NFT.
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
                <Button
                  variant="link"
                  as="a"
                  href={`https://translator.shyft.to/address/${address}?cluster=devnet&compressed=true`}
                  target="_blank"
                >
                  View NFT
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
