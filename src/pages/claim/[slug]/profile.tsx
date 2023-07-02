import ConnectWalletButton from "@/components/ConnectWalletButton"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { IconButton } from "@/components/ui/IconButton"
import { Typography } from "@/components/ui/Typography"
import { ClaimDto, DropDto, NftDto } from "@/types/apis"
import { useWallet } from "@solana/wallet-adapter-react"
import { HomeIcon } from "lucide-react"
import Image from "next/image"
import { useGetClaimsByEmail } from "@/hooks/useGetClaimsByEmail"
import { NFTItemSkeleton } from "@/components/dashboard/NFTItem"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { WithdrawNFTModal } from "@/components/claim-nft/WithdrawNftModal"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { SiteLayout } from "@/components/sites/SiteLayout"
import { ProfileTabs } from "@/components/sites/ProfileTabs"

const ProfilePage = () => {
  const { claims = [], isLoading, mutate } = useGetClaimsByEmail('session?.user?.user.email' as string | undefined)
  const { query } = useRouter()

  return (
    <>
      {/* <div className="!absolute !right-6 !top-6 flex items-center gap-4">
        <ConnectWalletButton />
        <Link replace href={`/claim/${query.slug}`}>
          <IconButton className="bg-warning-500 text-white hover:bg-warning-700">
            <HomeIcon />
          </IconButton>
        </Link>
      </div> */}

      <div className="mx-auto w-full max-w-screen-xl grow px-4 pt-16 md:px-6 md:pt-20">
        <div className="py-6 md:py-8 lg:py-10">
          <Typography as="h4" level="body1" className="font-bold">
            Your NFTs
          </Typography>
        </div>
        <ProfileTabs />
        {/* <div className="w-full rounded-2xl bg-white p-10 shadow-dropdown">
          <Typography as="h6" level="body2" className="font-bold">
            Your NFTs
          </Typography>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, idx) => <NFTItemSkeleton key={idx} />)
            ) : (
              <>
                {claims?.length === 0 ? (
                  <div className="col-span-2 col-start-2 text-center">
                    <Typography className="text-center font-semibold">No NFT found</Typography>
                  </div>
                ) : (
                  claims?.map((claim) => (
                    <NFTItem
                      key={claim.id}
                      claim={claim}
                      // @ts-ignore
                      nft={claim.drop?.nft}
                      // @ts-ignore
                      nftDrop={claim.drop}
                      onSucces={mutate}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div> */}
      </div>
    </>
  )
}

export default ProfilePage

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>
}
