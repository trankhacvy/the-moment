import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Typography } from "@/components/Typography"
import { Button } from "../Button"
import Image from "next/image"
import { KeyIcon, MailPlusIcon, WalletIcon } from "lucide-react"
import { SolanaQRCode } from "./SolanaPayQRCode"
import { Database } from "@/types/supabase.types"
import dynamic from "next/dynamic"
import { useWallet } from "@solana/wallet-adapter-react"
import { useToast } from "../Toast"
import { useEffect, useState } from "react"
import axios from "axios"
import { ClaimSuccessModal } from "./ClaimSuccessModal"

const WalletMultiButton = dynamic(
  import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  {
    ssr: false,
  }
)

type ClaimMenuProps = {
  eventId: string
  event: Database["public"]["Tables"]["poap_events"]["Row"]
  eventDrop: Database["public"]["Tables"]["poap_event_drops"]["Row"]
  nft?: Database["public"]["Tables"]["poap_nfts"]["Row"]
}

const ClaimMenu = ({ event, nft, eventDrop }: ClaimMenuProps) => {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast, dismiss } = useToast()
  const [resultItem, setResultItem] = useState<{ signature: string; image: string }>({
    signature: "",
    image: "",
  })

  const claimByConnectedWallet = async () => {
    setOpen(false)
    const { id } = toast({
      title: "Withdrawing...",
      duration: 1000 * 1000,
    })

    try {
      const response = await axios.post<any>("/api/claim-nft", {
        eventId: event.id,
        walletAddress: publicKey?.toBase58(),
      })
      dismiss(id)
      if (response.status === 200) {
        setResultItem({
          signature: response.data.data.signature,
          image: response.data.data.image,
        })
        setSuccess(true)
      }
    } catch (error) {
      dismiss(id)
      console.error(error)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Claim your NFT</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <ul className="p-2">
          {nft && (
            <SolanaQRCode
              eventId={event.id}
              logo={nft.image ?? ""}
              eventName={event.name ?? ""}
              trigger={
                <li className="cursor-pointer rounded-md p-2 hover:bg-gray-500/8">
                  <Image alt="SolanaPay" width={64.5} height={24} src="/assets/solana-pay.png" />
                </li>
              }
            />
          )}

          {publicKey && connected ? (
            <li
              onClick={claimByConnectedWallet}
              className="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8"
            >
              <WalletIcon className="h-6 w-6" />
              <Typography>Connected Wallet</Typography>
            </li>
          ) : (
            <li className="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8">
              <WalletMultiButton className="!h-6 bg-white !px-0 text-left !font-normal !text-gray-900 hover:!bg-transparent focus:!bg-transparent">
                Connected Wallet
              </WalletMultiButton>
            </li>
          )}

          <li className="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8">
            <MailPlusIcon className="h-6 w-6" />
            <Typography>Email</Typography>
          </li>
          <li className="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 hover:bg-gray-500/8">
            <KeyIcon />
            <Typography>Wallet address</Typography>
          </li>
        </ul>
      </PopoverContent>
      {resultItem.signature && resultItem.image && (
        <ClaimSuccessModal
          signature={resultItem.signature}
          image={resultItem.image}
          trigger={<button className="hidden" />}
          isOpen={success}
          onOpenChange={setSuccess}
        />
      )}
    </Popover>
  )
}

export { ClaimMenu }
