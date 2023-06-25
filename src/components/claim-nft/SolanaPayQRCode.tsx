import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay"
import { Keypair } from "@solana/web3.js"
import { XIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Typography } from "@/components/ui/Typography"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { IconButton } from "@/components/ui/IconButton"
import { DropDto } from "@/types/apis"
import { BASE_API_URL } from "@/config/common"

interface SolanaQRCodeProps {
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  nftDrop: DropDto
  trigger: React.ReactNode
}

export const SolanaQRCode = ({ isOpen, onOpenChange, nftDrop, trigger }: SolanaQRCodeProps) => {
  const reference = useMemo(() => Keypair.generate().publicKey, [])
  // const [open, setIsOpen] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (!nftDrop || !isOpen || !qrRef.current) return

      setLoading(true)
      const apiUrl = `${BASE_API_URL}/claims/solana-pay?dropId=${nftDrop.id}&label=${nftDrop.nft?.name}&icon=${nftDrop.nft?.image}}&network=devnet`
      console.log("apiUrl", apiUrl)
      const urlParams: TransactionRequestURLFields = {
        link: new URL(apiUrl),
        label: nftDrop.nft?.name,
        message: "Thank you for participating in our event",
      }
      const solanaUrl = encodeURL(urlParams)
      const qr = createQR(solanaUrl, 480, "transparent")
      if (qrRef.current) {
        qrRef.current.innerHTML = ""
        qr.append(qrRef.current)
        setLoading(false)
      }
    }, 100)
  }, [isOpen, nftDrop, qrRef])

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Scan QR Code</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <AspectRatio className="overflow-hidden">
            <div ref={qrRef} className="qr-container h-full w-full rounded-2xl" />
          </AspectRatio>
        </AlertDialogDescription>
        <AlertDialogFooter className="!justify-center">
          <Typography>Scan this QR Code to receive your POAP</Typography>
        </AlertDialogFooter>
        <AlertDialogCancel asChild>
          <IconButton size="sm" className="absolute right-2 top-2">
            <XIcon />
            <span className="sr-only">Close {loading}</span>
          </IconButton>
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  )
}
