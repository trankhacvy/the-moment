import ConnectWalletButton from "@/components/ConnectWalletButton"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { IconButton } from "@/components/ui/IconButton"
import { Typography } from "@/components/ui/Typography"
import { ClaimDto, DropDto, NftDto } from "@/types/apis"
import { useWallet } from "@solana/wallet-adapter-react"
import { HomeIcon } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useGetClaimsByEmail } from "@/hooks/useGetClaimsByEmail"
import { NFTItemSkeleton } from "@/components/dashboard/NFTItem"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { WithdrawNFTModal } from "@/components/claim-nft/WithdrawNftModal"

const ProfilePage = () => {
  const { data: session } = useSession()
  const { claims, isLoading, mutate } = useGetClaimsByEmail(session?.user?.email as string | undefined)

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-20">
      <div className="container mx-auto w-full px-4 md:px-6 ">
        <div className="w-full rounded-2xl bg-white p-10 shadow-dropdown">
          <Typography as="h6" level="body2" className="font-bold">
            Your NFTs
          </Typography>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 9 }).map((_, idx) => <NFTItemSkeleton key={idx} />)
              : claims?.map((claim) => (
                  // @ts-ignore
                  <NFTItem key={claim.id} claim={claim} nft={claim.drop?.nft} nftDrop={claim.drop} onSucces={mutate} />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type NFTItemProps = {
  claim: ClaimDto
  nft: NftDto
  nftDrop: DropDto
  onSuccess?: VoidFunction
}

export const NFTItem = ({ claim, nft, nftDrop, onSuccess }: NFTItemProps) => {
  const { connected, publicKey } = useWallet()

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="!absolute !right-6 !top-6 flex items-center gap-4">
        <ConnectWalletButton />
        <Link replace href={`/claim/${nftDrop.suffix}`}>
          <IconButton className="bg-warning-500 text-white hover:bg-warning-700">
            <HomeIcon />
          </IconButton>
        </Link>
      </div>

      <AspectRatio>
        <Image src={nft.image} alt={nft.name} fill />
      </AspectRatio>
      <div className="p-5">
        <Typography className="mb-2 font-semibold">{nft.name}</Typography>
        <Typography color="secondary" level="body4" className="line-clamp-2 text-ellipsis">
          {nft.description}
        </Typography>
        <div className="mt-4 flex justify-end">
          {claim.owner ? (
            <Button variant="outline" disabled>
              Claimed
            </Button>
          ) : (
            <>
              {connected && publicKey ? (
                <WithdrawNFTModal
                  nftDrop={nftDrop}
                  trigger={
                    <Button className="" size="sm">
                      Withdraw
                    </Button>
                  }
                  onSuccess={onSuccess}
                />
              ) : (
                <ConnectWalletButton />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
