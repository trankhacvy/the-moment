import { clusterApiUrl, Connection, Keypair, Transaction } from "@solana/web3.js"
import cx from "classnames"
import dayjs from "dayjs"
import { GlobeIcon, LaptopIcon, MapPin, StoreIcon } from "lucide-react"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useMemo } from "react"
import useSWR from "swr"
import { Typography } from "@/components/Typography"
import { Supabase } from "@/libs/supabase"
import { Database } from "@/types/supabase.types"
import { truncate } from "@/utils/truncate"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import axios from "axios"
import { useWallet } from "@solana/wallet-adapter-react"
import { ClaimMenu } from "@/components/claim-nft/ClaimMenu"
import dynamic from "next/dynamic"

const WalletDisconnectButton = dynamic(
  import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletDisconnectButton),
  {
    ssr: false,
  }
)

export default function Event({
  event,
  eventDrop,
  nft,
}: {
  event: Database["public"]["Tables"]["poap_events"]["Row"]
  eventDrop?: Database["public"]["Tables"]["poap_event_drops"]["Row"]
  nft?: Database["public"]["Tables"]["poap_nfts"]["Row"]
}) {
  const router = useRouter()

  const eventId = router.query.eventId as string

  const { publicKey, sendTransaction } = useWallet()

  const { data: transactions } = useSWR(
    eventDrop?.id ? ["transactions", eventDrop.id] : null,
    async () => {
      const { data, error } = await Supabase.from("poap_claims").select("*").eq("event_drop_id", eventDrop?.id)
      // .eq("status", "success")
      if (error) return null
      return data
    },
    {
      refreshInterval: 1000,
    }
  )

  const reference = useMemo(() => Keypair.generate().publicKey, [])

  // Get a connection to Solana devnet
  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const connection = new Connection(endpoint)

  const _mintByHandle = async () => {
    try {
      console.log("publicKey", publicKey)
      if (!publicKey) return

      const res = await axios.post(`/api/transaction?eventId=${eventId}&reference=${reference.toString()}`, {
        account: publicKey?.toBase58(),
      })
      const tx = Transaction.from(Buffer.from(res.data.transaction, "base64"))
      const signature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, "processed")
      console.log("signature", signature)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-40">
      <div className="fixed right-6 top-6">
        <WalletDisconnectButton />
      </div>
      <div className="mx-auto mb-10 flex h-64 w-full max-w-screen-md overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="relative h-64 w-64">
          <img className="h-auto w-full rounded-l-2xl" src={nft?.image ?? event.logo!} alt={event.name!} />
          <div
            className={cx(
              "absolute left-8 top-0 flex w-16 flex-col items-center bg-primary-500 px-3 pt-2 text-white",
              "before:absolute before:left-0 before:top-full before:h-[30px] before:w-1/2 before:border-b-[15px] before:border-l-[2rem] before:border-r-[2rem] before:border-t-[15px] before:border-b-transparent before:border-l-primary-500 before:border-r-transparent before:border-t-primary-500 before:content-['']",
              "after:absolute after:right-0 after:top-[100%] after:h-[30px] after:w-1/2 after:border-b-[15px] after:border-l-[2rem] after:border-r-[2rem] after:border-t-[15px] after:border-b-transparent after:border-l-transparent after:border-r-primary-500 after:border-t-primary-500 after:content-['']"
            )}
          >
            <Typography onClick={_mintByHandle} as="span" level="body4" className="font-semibold">
              {dayjs(event.start_date!).format("MMM")}
            </Typography>
            <Typography as="span" level="h6" className="font-bold">
              {dayjs(event.start_date!).format("DD")}
            </Typography>
          </div>
        </div>
        <div className="relative flex-1 p-6">
          <Typography as="span" level="body4" color="secondary" className="mb-2">
            {dayjs(event.start_date!).format("MMM D, YYYY h:mm A")}
          </Typography>
          <Typography as="h2" level="h6" className="mb-2 font-semibold">
            {event.name}
          </Typography>
          <Typography className="line-clamp-3" level="body3">
            {event.description}
          </Typography>
          <div className="absolute inset-x-6 bottom-6 flex gap-6 text-gray-500">
            <div className="flex items-center gap-1">
              {event.event_type === "in_person" ? (
                <StoreIcon className="h-5 w-5" />
              ) : (
                <LaptopIcon className="h-5 w-5" />
              )}
              <Typography as="span" level="body4" color="secondary">
                {event.event_type === "in_person" ? "In person" : "Online"}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              {event.event_type === "in_person" ? <MapPin className="h-5 w-5" /> : <GlobeIcon className="h-5 w-5" />}
              <Typography as="span" level="body4" color="secondary">
                {event.event_type === "in_person" ? event.location : "Discord"}
              </Typography>
            </div>
            {/* <QRCodeDialog eventId={eventId} eventName={event.name!} logo={event.logo!} reference={reference} /> */}
            <div className="flex flex-1 justify-end">
              {eventDrop && <ClaimMenu event={event} eventDrop={eventDrop} eventId={eventId} nft={nft} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-md overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="p-6">
          <Typography as="h2" level="body2" className="font-bold">
            Participants
          </Typography>
        </div>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Owner</th>
              <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Mint Date</th>
              <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">NFT</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((tx) => (
              <tr key={tx.id}>
                <td className="line-clamp-1 p-4">{truncate(tx.owner ?? "", 16, true)}</td>
                <td className="p-4">{dayjs(tx.created_at).format("DD/MM/YYYY")}</td>
                <td className="p-4">
                  <a
                    href={`https://translator.shyft.to/address/${tx.nft_address}?cluster=devnet&compressed=true`}
                    className="line-clamp-1 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncate(tx.nft_address ?? "", 16, true)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<{
  event: Database["public"]["Tables"]["poap_events"]["Row"]
}> = async (context) => {
  const { params } = context

  if (!params?.eventId) {
    return {
      notFound: true,
    }
  }

  const { data: event, error } = await Supabase.from("poap_events")
    .select("*,poap_event_drops(*)")
    .eq("id", params.eventId)
    .maybeSingle()

  if (!event || error) {
    return {
      notFound: true,
    }
  }

  const eventDrop = event.poap_event_drops?.[0]

  let nft
  if (eventDrop) {
    const { data } = await Supabase.from("poap_nfts").select("*").eq("event_drop_id", eventDrop.id).maybeSingle()

    if (data) {
      nft = data
    }
  }

  return {
    props: {
      event,
      eventDrop,
      nft,
    },
  }
}
