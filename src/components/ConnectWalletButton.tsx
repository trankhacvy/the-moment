import dynamic from "next/dynamic"
import { cn } from "@/utils/cn"

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

export default function ConnectWalletButton({ className }: any) {
  return (
    <WalletMultiButtonDynamic
      className={cn(
        [
          "inline-flex items-center justify-center !rounded-lg !text-sm !font-semibold !shadow-xs !transition-colors",
          "focus:outline-none focus:ring-4",
          "disabled:pointer-events-none",
          "active:scale-95",
          "!bg-gray-800 !text-white",
          "hover:!bg-gray-700",
          "focus:!ring-gray-800/16",
          "!h-10",
        ],
        className
      )}
    />
  )
}
