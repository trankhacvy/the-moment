import ConnectWalletButton from "@/components/ConnectWalletButton"
import { NextSeo } from "next-seo"
import { SolanaQRCode } from "@/components/claim-nft/SolanaPayQRCode"
import { WalletClaimModal } from "@/components/claim-nft/WalletClaimModal"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { IconButton } from "@/components/ui/IconButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { Typography } from "@/components/ui/Typography"
import { client } from "@/libs/api"
import { DropDto, NftDto } from "@/types/apis"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { MailIcon, QrCodeIcon, WalletIcon } from "lucide-react"
import { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"

const ClaimPage = ({ nftDrop }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const nft = nftDrop.nft as NftDto
  const { setVisible } = useWalletModal()
  const { connected, publicKey } = useWallet()
  const [isOpenQr, setIsOpenQr] = useState(false)
  const [isClaimWalletOpen, setIsClaimWalletOpen] = useState(false)
  const { asPath } = useRouter()

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-20">
      <NextSeo
        title={`Claim ${nft.name} NFT | The moment`}
        description="The moment - The easiest way to claim your POAP on Solana."
        openGraph={{
          url: `${APP_BASE_URL}${asPath}`,
          images: [
            {
              width: 1200,
              height: 630,
              url: nft.image,
            },
          ],
        }}
      />

      <div className="!absolute !right-6 !top-6">
        <ConnectWalletButton />
      </div>
      <div className="flex flex-col gap-10">
        <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-dropdown">
          <AspectRatio className="overflow-hidden rounded-xl">
            <Image
              className="transition-transform duration-500 ease-in-out hover:scale-125"
              alt={nft.name}
              src={nft.image}
              fill
            />
          </AspectRatio>
          <div className="mt-4">
            <Typography as="h6" level="body2" className="font-bold">
              {nft.name}
            </Typography>
            <Typography level="body4" className="mt-1">
              {nft.description}
            </Typography>
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-5">
          <SolanaQRCode
            isOpen={isOpenQr}
            onOpenChange={setIsOpenQr}
            nftDrop={nftDrop}
            trigger={
              <ActionButton
                description="Claim by Solana Pay"
                trigger={
                  <IconButton onClick={() => setIsOpenQr(true)} className="bg-white shadow-dropdown hover:bg-white">
                    <QrCodeIcon />
                  </IconButton>
                }
              />
            }
          />

          <WalletClaimModal
            isOpen={isClaimWalletOpen}
            onOpenChange={setIsClaimWalletOpen}
            trigger={
              <ActionButton
                description="Claim by wallet"
                trigger={
                  <IconButton
                    onClick={(event) => {
                      if (!connected || !publicKey) {
                        event.preventDefault()
                        setVisible(true)
                        return
                      }
                      setIsClaimWalletOpen(true)
                    }}
                    className="bg-white shadow-dropdown hover:bg-white"
                  >
                    <WalletIcon />
                  </IconButton>
                }
              />
            }
            nftDrop={nftDrop}
          />

          <ActionButton
            description="Claim by email"
            trigger={
              <IconButton className="bg-white shadow-dropdown hover:bg-white">
                <MailIcon />
              </IconButton>
            }
          />
        </div>
      </div>
    </div>
  )
}

const ActionButton = ({ trigger, description }: { trigger: React.ReactNode; description: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>
        <Typography>{description}</Typography>
      </TooltipContent>
    </Tooltip>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<{
  nftDrop: DropDto
}> = async (context) => {
  const { params } = context

  if (!params?.slug) {
    return {
      notFound: true,
    }
  }

  try {
    const nftDrop = await client.getDropBySuffix(params.slug as string)

    if (!nftDrop || !nftDrop.nft) {
      return {
        notFound: true,
      }
    }

    return { props: { nftDrop } }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}

export default ClaimPage
