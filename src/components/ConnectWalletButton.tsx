import dynamic from "next/dynamic"
import { cn } from "@/utils/cn"
import { buttonVariants } from "@/components/ui/Button"

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
          "!bg-warning-500 text-white",
          "hover:!bg-warning-700",
          "focus:!ring-warning-100",
          "disabled:!bg-warning-200",
          "!h-10 !px-2.5",
        ],
        className
      )}
    />
  )
}
