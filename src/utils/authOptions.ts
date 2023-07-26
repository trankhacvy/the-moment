import { client } from "@/libs/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useCallback, useEffect, useState } from "react"
import { useUserAuth } from "@/hooks/useUserAuth"
import { useRouter } from "next/router"

export function useWalletLogin(redirect?: boolean) {
  const { asPath, query, pathname, replace } = useRouter()
  const { mutateUser } = useUserAuth(null)
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [openModal, setOpenModal] = useState(false)

  const login = useCallback(async () => {
    try {
      if (!connected || !publicKey) {
        setOpenModal(true)
        setVisible(true)
        return
      }
      // await client.walletLogin(publicKey?.toBase58() ?? "")
      await mutateUser()
      replace(redirect ? `${asPath}?claim=wallet` : asPath, undefined, { shallow: true })
    } catch (error) {
      console.error(error)
    }
  }, [connected, publicKey])

  useEffect(() => {
    if (connected && openModal) {
      login()
    }
  }, [openModal, connected])

  return login
}
