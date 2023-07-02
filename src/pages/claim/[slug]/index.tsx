import { NextSeo } from "next-seo"
import { SolanaQRCode } from "@/components/claim-nft/SolanaPayQRCode"
import { WalletClaimModal } from "@/components/claim-nft/WalletClaimModal"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { Typography } from "@/components/ui/Typography"
import { client } from "@/libs/api"
import { DropDto, NftDto } from "@/types/apis"
import { MailIcon, WalletIcon } from "lucide-react"
import { GetStaticProps, InferGetStaticPropsType } from "next"
import Image from "next/image"
import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { APP_BASE_URL } from "@/config/env"
import { signIn } from "next-auth/react"
import { EmailClaimModal } from "@/components/claim-nft/EmailClaimModal"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/Button"
// import { SiteHeader } from "@/components/sites/SiteHeader"
import { useWalletLogin } from "@/utils/authOptions"
import { SiteLayout } from "@/components/sites/SiteLayout"
// import { useUserAuth } from "@/hooks/use-user-auth"
import { useWallet } from "@solana/wallet-adapter-react"
import { useUserAuth } from "@/hooks/use-user-auth"

const ClaimPage = ({ nftDrop }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const nft = nftDrop.nft as NftDto
  const [isOpenQr, setIsOpenQr] = useState(false)
  const [isClaimWalletOpen, setIsClaimWalletOpen] = useState(false)
  const [isClaimEmailOpen, setIsClaimEmailOpen] = useState(false)
  const { asPath, query, replace, pathname } = useRouter()
  const { connected } = useWallet()

  const { isLoggedIn, user } = useUserAuth(null)

  const claimParam = query.claim

  const loginWithWallet = useWalletLogin(true)

  useEffect(() => {
    if (!isLoggedIn) return

    setTimeout(() => {
      if (claimParam === "wallet") {
        setIsClaimWalletOpen(true)
      }

      // if (claimParam === "email") {
      //   setIsClaimEmailOpen(true)
      // }
    }, 150)
  }, [claimParam, isLoggedIn])

  // useEffect(() => {
  //   if ((!isClaimWalletOpen && query?.claim === "wallet") || (!isClaimEmailOpen && query?.claim === "email")) {
  //     replace(
  //       {
  //         pathname,
  //         query: {
  //           slug: query.slug,
  //         },
  //       },
  //       undefined,
  //       { shallow: true }
  //     )
  //   }
  // }, [isClaimWalletOpen, isClaimEmailOpen, query])

  return (
    <div>
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

      <div className="mx-auto w-full max-w-screen-xl grow px-4 pt-16 md:px-6 md:pt-20">
        <div className="-mx-4 flex flex-wrap md:-mx-8">
          <div className="w-full grow-0 p-4 md:w-5/12 md:p-8">
            <AspectRatio className="overflow-hidden rounded-xl">
              <Image alt={nft.name} src={nft.image} fill />
            </AspectRatio>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3 md:hidden">
              <SolanaQRCode
                isOpen={isOpenQr}
                onOpenChange={setIsOpenQr}
                nftDrop={nftDrop}
                trigger={
                  <ActionButton
                    description="Claim by Solana Pay"
                    trigger={
                      <Button
                        onClick={() => setIsOpenQr(true)}
                        startDecorator={<Image width={27} height={24} alt="solana pay" src="/assets/solana-icon.png" />}
                        scheme="default"
                      >
                        Pay
                      </Button>
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
                      <Button
                        onClick={(event) => {
                          if (!"session") {
                            event.preventDefault()
                            loginWithWallet()
                            return
                          }
                          setIsClaimWalletOpen(true)
                        }}
                        scheme="default"
                        startDecorator={<WalletIcon />}
                      >
                        Use Wallet
                      </Button>
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
                      <Button
                        onClick={(event) => {
                          if (!"session") {
                            event.preventDefault()
                            signIn("github", {
                              callbackUrl: `${asPath}?claim=email`,
                            })
                            return
                          }
                          setIsClaimEmailOpen(true)
                        }}
                        scheme="default"
                        startDecorator={<MailIcon />}
                      >
                        Use Email
                      </Button>
                    }
                  />
                }
              />
            </div>
          </div>
          <div className="w-full grow-0 p-4 md:w-7/12 md:p-8 lg:w-5/12">
            <div className="flex h-full flex-col justify-center">
              <h1 className="line-clamp-2 text-4xl font-extrabold sm:text-5xl lg:text-6xl">{nft.name}</h1>
              <Typography className="mt-4">{nft.description}</Typography>

              <div className="mt-10 hidden items-center gap-5 md:flex">
                <SolanaQRCode
                  isOpen={isOpenQr}
                  onOpenChange={setIsOpenQr}
                  nftDrop={nftDrop}
                  trigger={
                    <ActionButton
                      description="Claim by Solana Pay"
                      trigger={
                        <Button
                          onClick={() => setIsOpenQr(true)}
                          startDecorator={
                            <Image width={27} height={24} alt="solana pay" src="/assets/solana-icon.png" />
                          }
                          scheme="default"
                        >
                          Pay
                        </Button>
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
                        <Button
                          onClick={(event) => {
                            if (!connected || !isLoggedIn) {
                              event.preventDefault()
                              loginWithWallet()
                              return
                            }
                            setIsClaimWalletOpen(true)
                          }}
                          scheme="default"
                          startDecorator={<WalletIcon />}
                        >
                          Use Wallet
                        </Button>
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
                        <Button
                          onClick={(event) => {
                            if (!"session") {
                              event.preventDefault()
                              signIn("github", {
                                callbackUrl: `${asPath}?claim=email`,
                              })
                              return
                            }
                            setIsClaimEmailOpen(true)
                          }}
                          scheme="default"
                          startDecorator={<MailIcon />}
                        >
                          Use Email
                        </Button>
                      }
                    />
                  }
                />
              </div>

              <div className="mt-10 flex gap-6">
                {/* <SolanaQRCode
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
                /> */}

                {/* <WalletClaimModal
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
                /> */}

                {/* <EmailClaimModal
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
                          color="primary"
                          // className="bg-white shadow-dropdown hover:bg-white"
                        >
                          <MailIcon />
                        </IconButton>
                      }
                    />
                  }
                /> */}
              </div>
            </div>
          </div>
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
    const nftDrop = await client.getDropBySlug(params.slug as string)

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

ClaimPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>
}
