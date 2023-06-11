import useSWR from "swr"
import { truncate } from "@/utils/truncate"
import dayjs from "dayjs"
import { Supabase } from "@/libs/supabase"

type ParticipantsTabProps = {
  eventDropId?: string
}

export const ParticipantsTab = ({ eventDropId }: ParticipantsTabProps) => {
  const { data: transactions = [] } = useSWR(
    eventDropId ? ["transactions", eventDropId] : null,
    async () => {
      const { data, error } = await Supabase.from("poap_claims").select("*").eq("event_drop_id", eventDropId)
      if (error) return null
      return data
    },
    {
      refreshInterval: 1000,
    }
  )

  return (
    <div className="p-0">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Owner</th>
            <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Mint Date</th>
            <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">NFT</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.length === 0 && (
            <tr className="text-center">
              <td />
              <td className="p-6">No item found</td>
              <td />
            </tr>
          )}

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
  )
}
