import { useGetClaimsByEmail } from "@/hooks/useGetClaimsByEmail"
import { useSession } from "next-auth/react"
import { NFTCardSkeleton } from "./NFTCard"
import { Typography } from "../ui/Typography"

export const ClaimedNFTs = () => {
  // const { data: session } = useSession()
  const { claims = [], isLoading } = useGetClaimsByEmail('session?.user?.user.email' as string | undefined)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <NFTCardSkeleton key={idx} />
        ))}
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Typography className="font-semibold" color="secondary">
          No NFT
        </Typography>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {claims.map((_, idx) => (
        <NFTCardSkeleton key={idx} />
      ))}
    </div>
  )
}
