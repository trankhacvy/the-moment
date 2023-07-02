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
import { MailIcon, QrCodeIcon, UserIcon, WalletIcon } from "lucide-react"
import { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { EmailClaimModal } from "@/components/claim-nft/EmailClaimModal"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/Button"

const ClaimPage = ({ nftDrop }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const { data: session } = useSession()
  const nft = nftDrop.nft as NftDto
  const { setVisible } = useWalletModal()
  const { connected, publicKey } = useWallet()
  const [isOpenQr, setIsOpenQr] = useState(false)
  const [isClaimWalletOpen, setIsClaimWalletOpen] = useState(false)
  const [isClaimEmailOpen, setIsClaimEmailOpen] = useState(false)
  const { asPath } = useRouter()

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <NextSeo
        title={`Claim ${nft.name} NFT | ${siteConfig.name}`}
        description={`${siteConfig.name} - The easiest way to claim your POAP on Solana.`}
        openGraph={{
          url: `${APP_BASE_URL}${asPath}`,
          images: [
            {
              url: nft.image,
            },
          ],
        }}
      />

      <header className="fixed left-0 top-0 z-[1000] w-full">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/">
            <Image width={48} height={40} src="/assets/logo.png" alt="Minions" />
          </Link>
          <Button
            onClick={() => {
              signIn("github")
            }}
          >
            Login
          </Button>
        </div>
      </header>

      <div className="container mx-auto grow pt-16">
        <div className="flex flex-wrap">
          <div className="w-1/2 grow-0 p-4 md:p-6">
            <div className="mx-auto max-w-md">
              <AspectRatio className="overflow-hidden rounded-xl">
                <Image
                  className="transition-transform duration-500 ease-in-out hover:scale-125"
                  alt={nft.name}
                  src={nft.image}
                  fill
                />
              </AspectRatio>
            </div>
          </div>
          <div className="w-1/2 grow-0 p-4 md:p-6">
            <div className="flex h-full flex-col justify-center">
              <Typography as="h1" level="h2" className="font-extrabold">
                {nft.name}
              </Typography>
              <Typography className="mt-2">{nft.description}</Typography>
              <div className="mt-10 flex gap-6">
                <SolanaQRCode
                  isOpen={isOpenQr}
                  onOpenChange={setIsOpenQr}
                  nftDrop={nftDrop}
                  trigger={
                    <ActionButton
                      description="Claim by Solana Pay"
                      trigger={
                        <IconButton
                          onClick={() => setIsOpenQr(true)}
                          color="primary"
                          // className="bg-white shadow-dropdown hover:bg-white"
                        >
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
                          color="primary"
                          // className="bg-white shadow-dropdown hover:bg-white"
                        >
                          <WalletIcon />
                        </IconButton>
                      }
                    />
                  }
                  nftDrop={nftDrop}
                />

                <EmailClaimModal
                  isOpen={isClaimEmailOpen}
                  onOpenChange={setIsClaimEmailOpen}
                  nftDrop={nftDrop}
                  trigger={
                    <ActionButton
                      description="Claim by email"
                      trigger={
                        <IconButton
                          onClick={(event) => {
                            if (!'session') {
                              event.preventDefault()
                              signIn("github")
                              return
                            }
                            setIsClaimEmailOpen(true)
                          }}
                          color="primary"
                          // className="bg-white shadow-dropdown hover:bg-white"
                        >
                          <MailIcon />
                        </IconButton>
                      }
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="!absolute !right-6 !top-6 flex items-center gap-4">
        <ConnectWalletButton />
        {session && (
          <Link href={`/claim/${nftDrop.suffix}/profile`}>
            <IconButton className="bg-warning-500 text-white hover:bg-warning-700">
              <UserIcon />
            </IconButton>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-10">
        <div className="w-[360px] rounded-2xl bg-white p-4 shadow-dropdown">
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

          <EmailClaimModal
            isOpen={isClaimEmailOpen}
            onOpenChange={setIsClaimEmailOpen}
            nftDrop={nftDrop}
            trigger={
              <ActionButton
                description="Claim by email"
                trigger={
                  <IconButton
                    onClick={(event) => {
                      if (!session) {
                        event.preventDefault()
                        signIn("github")
                        return
                      }
                      setIsClaimEmailOpen(true)
                    }}
                    className="bg-white shadow-dropdown hover:bg-white"
                  >
                    <MailIcon />
                  </IconButton>
                }
              />
            }
          />
        </div>
      </div> */}
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
