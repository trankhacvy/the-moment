import bs58 from "bs58"
import { SigninMessage } from "@/utils/SigninMessage"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Routes } from "@/config/routes"

const HomePage = () => {
  const { status } = useSession()
  const { connected, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const [openModal, setOpenModal] = useState(false)

  const handleSignIn = async () => {
    try {
      if (!connected) {
        setVisible(true)
      }
      const csrf = await getCsrfToken()
      if (!publicKey || !csrf || !signMessage) return

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      })

      const data = new TextEncoder().encode(message.prepare())
      const signature = await signMessage(data)
      const serializedSignature = bs58.encode(signature)

      signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        callbackUrl: Routes.DASHBOARD,
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (connected && status === "unauthenticated" && openModal) {
      handleSignIn()
    }
  }, [connected, status, openModal])

  return (
    <section className="min-h-screen bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
            Gasless <span className="text-primary-500">POAP</span> Dispenser on Solana
          </h1>
          <p className="mb-6 max-w-2xl font-light text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
            Effortlessly create and distribute POAPs with cost-effective compressed NFT
          </p>
          <button
            onClick={() => {
              if (!connected) {
                setVisible(true)
                setOpenModal(true)
                return
              }
              handleSignIn()
            }}
            className="mr-3 inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
          >
            Get started
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
          <img className="" src="/assets/nft-logo.png" alt="hero" />
        </div>
      </div>
    </section>
  )
}

export default HomePage
