import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay"
import { Keypair } from "@solana/web3.js"
import { XIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Typography } from "@/components/Typography"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/AlertDialog"
import { AspectRatio } from "@/components/AspectRatio"
import { IconButton } from "@/components/IconButton"

export const SolanaQRCode = ({
  eventId,
  eventName,
  logo,
  trigger,
}: {
  eventId: string
  eventName: string
  logo: string
  trigger: React.ReactNode
}) => {
  const reference = useMemo(() => Keypair.generate().publicKey, [])
  const [open, setIsOpen] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (!eventId || !open || !qrRef.current) return

      setLoading(true)
      const { location } = window
      const apiUrl = `${location.protocol}//${
        location.host
      }/api/transaction?eventId=${eventId}&name=${eventName}&logo=${logo}}`
      const urlParams: TransactionRequestURLFields = {
        link: new URL(apiUrl),
        label: eventName,
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
  }, [open, qrRef])

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
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
