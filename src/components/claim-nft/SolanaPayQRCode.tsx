import { createQR, encodeURL, findReference, TransactionRequestURLFields, FindReferenceError } from "@solana/pay"
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
import Image from "next/image"
import { useConnection } from "@solana/wallet-adapter-react"

interface SolanaQRCodeProps {
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  nftDrop: DropDto
  trigger: React.ReactNode
}

export const SolanaQRCode = ({ isOpen, onOpenChange, nftDrop, trigger }: SolanaQRCodeProps) => {
  const reference = useMemo(() => Keypair.generate().publicKey, [])
  const qrRef = useRef<HTMLDivElement>(null)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [signature, setSignature] = useState("")
  const { connection } = useConnection()

  useEffect(() => {
    setTimeout(() => {
      if (!nftDrop || !isOpen || !qrRef.current || !reference) return

      const apiUrl = `${BASE_API_URL}/claims/solana-pay?dropId=${nftDrop.id}&label=${nftDrop.nft?.name}&icon=${
        nftDrop.nft?.image
      }}&network=devnet&reference=${reference.toBase58()}`
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
      }
    }, 100)
  }, [isOpen, nftDrop, qrRef, reference])

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(async () => {
      try {
        if (processing) return
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference, { finality: "confirmed" })
        setProcessing(true)
        setTimeout(() => {
          setSuccess(true)
          setSignature(signatureInfo.signature)
          console.log("signatureInfo", signatureInfo)
          // Validate that the transaction has the expected recipient, amount and SPL token
        }, 1200)
        clearInterval(interval)
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return
        }
        // if (e instanceof ValidateTransferError) {
        //   // Transaction is invalid
        //   console.error('Transaction is invalid', e)
        //   return;
        // }
        console.error("Unknown error", e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [success, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false)
      setProcessing(false)
    }
  }, [isOpen])

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg">
        {!processing && (
          <AlertDialogHeader>
            <AlertDialogTitle>Scan QR Code</AlertDialogTitle>
          </AlertDialogHeader>
        )}
        <div>
          {!processing ? (
            <AspectRatio className="overflow-hidden">
              <div ref={qrRef} className="qr-container h-full w-full rounded-2xl" />
            </AspectRatio>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 p-3">
                {!success && (
                  <span className="absolute inset-0">
                    <svg className="h-full w-full animate-spin">
                      <defs>
                        <radialGradient
                          id="preview_loader"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="rotate(92.189 20.447 29.794) scale(157.115)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset=".157" stop-color="#FF7E62"></stop>
                          <stop offset=".753" stop-color="#A56FFE"></stop>
                        </radialGradient>
                      </defs>
                      <circle
                        className="fill-transparent stroke-[5px]"
                        style={{
                          strokeLinecap: "round",
                          strokeDasharray: 380,
                          strokeDashoffset: 90,
                        }}
                        r="75"
                        cx="50%"
                        cy="50%"
                        stroke-linecap="round"
                        stroke="url(#preview_loader)"
                      ></circle>
                    </svg>
                  </span>
                )}
                <AspectRatio className="relative overflow-hidden rounded-full">
                  {nftDrop.nft && <Image src={nftDrop.nft?.image} alt={nftDrop.nft?.name} fill />}
                </AspectRatio>
              </div>
              {success ? (
                <div className="mt-2 flex flex-col gap-3 text-center">
                  <Typography as="h6" level="h5" className="font-bold">
                    Congrats 🎉🎉
                  </Typography>
                  <Typography color="secondary">You've successfully claimed the NFT</Typography>
                  <a
                    className="text-gray-900 underline"
                    target="_blank"
                    href={`https://translator.shyft.to/tx/${signature}?cluster=devnet`}
                  >
                    View transaction
                  </a>
                </div>
              ) : (
                <Typography as="h6" level="body2" className="mt-5 font-bold">
                  Waiting for confirmation
                </Typography>
              )}
            </div>
          )}
        </div>
        {!processing && (
          <AlertDialogFooter className="!justify-center">
            <Typography className="text-center">Scan this QR Code to receive your NFT</Typography>
          </AlertDialogFooter>
        )}
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
  )
}
