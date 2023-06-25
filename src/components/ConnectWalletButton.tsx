import dynamic from "next/dynamic"
import { cn } from "@/utils/cn"
import { buttonVariants } from "@/components/ui/Button"

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

export default function ConnectWalletButton({ className }: any) {
  return <WalletMultiButtonDynamic className={cn(buttonVariants(), className)} />
}
