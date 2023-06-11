import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay"
import { Keypair } from "@solana/web3.js"
import dayjs from "dayjs"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Supabase } from "@/libs/supabase"
import { truncate } from "@/utils/truncate"
import { AspectRatio } from "./AspectRatio"
import { Button } from "./Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"

type EventStatisticsProps = {
  eventId: string
  name: string
}

export const EventStatistics = ({ eventId, name }: EventStatisticsProps) => {
  return (
    <div className="mt-10 flex gap-6 rounded-xl shadow-card">
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="qr_code">QR Code</TabsTrigger>
          <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
        </TabsList>
        <TabsContent value="participants">
          <ParticipantsList eventId={eventId} />
        </TabsContent>
        <TabsContent value="qr_code">
          <QRCode name={name} eventId={eventId} />
        </TabsContent>
        <TabsContent value="whitelist">
          <WhiteList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const ParticipantsList = ({ eventId }: { eventId: string }) => {
  const { data: transactions } = useSWR(
    eventId ? ["transactions", eventId] : null,
    async () => {
      const { data, error } = await Supabase.from("poap_transactions")
        .select("*")
        .eq("event_id", eventId)
        .eq("status", "success")
      if (error) return []
      return data
    },
    {
      refreshInterval: 1000,
    }
  )

  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr>
          <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Owner</th>
          <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Mint Date</th>
          <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Signature</th>
        </tr>
      </thead>
      <tbody>
        {transactions?.map((tx) => (
          <tr key={tx.id}>
            <td className="line-clamp-1 p-4">{truncate(tx.buyer ?? "", 16, true)}</td>
            <td className="p-4">{dayjs(tx.created_at).format("DD/MM/YYYY")}</td>
            <td className="p-4">
              <a
                href={`https://translator.shyft.to/tx/${tx.signature!}?cluster=devnet`}
                className="line-clamp-1 underline"
                target="_blank"
                rel="noreferrer"
              >
                {truncate(tx.signature ?? "", 16, true)}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const QRCode = ({ eventId, name }: { eventId: string; name: string }) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const reference = useMemo(() => Keypair.generate().publicKey, [])
  const [image, setImage] = useState("")

  useEffect(() => {
    setTimeout(() => {
      console.log("event", qrRef.current)
      if (!eventId || !reference || !qrRef.current) return

      const { location } = window
      const apiUrl = `${location.protocol}//${
        location.host
      }/api/transaction?eventId=${eventId}&reference=${reference.toString()}`
      const urlParams: TransactionRequestURLFields = {
        link: new URL(apiUrl),
        label: name,
        message: "Thank you for participating in our event",
      }
      const solanaUrl = encodeURL(urlParams)
      const qr = createQR(solanaUrl, 480, "transparent")
      setImage(qr._options.image ?? "")
      console.log("qr", qr)
      if (qrRef.current) {
        qrRef.current.innerHTML = ""
        qr.append(qrRef.current)
      }
    }, 100)
  }, [qrRef])

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = image
    link.download = "Download.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-lg text-center">
        <AspectRatio className="w-full overflow-hidden">
          <div ref={qrRef} className="qr-container h-full w-full rounded-2xl" />
        </AspectRatio>
        <Button onClick={downloadImage} variant="link">
          Download
        </Button>
      </div>
    </div>
  )
}

const WhiteList = () => {
  return <div></div>
}
