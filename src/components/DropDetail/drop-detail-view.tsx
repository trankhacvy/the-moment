import { Typography } from "../ui/Typography"
import { DropDto } from "@/types/apis"
import dayjs from "dayjs"
import { APP_BASE_URL } from "@/config/env"
import { Separator } from "../ui/Separator"
import { Badge } from "../ui/badge"

type DropDetailViewProps = {
  drop?: DropDto
}

export const DropDetailView = ({ drop }: DropDetailViewProps) => {
  const method = drop?.methods?.[0]

  if (!method) return null

  const dropStatus = () => {
    if (drop.status === "WAITING_FOR_PAYMENT") return <Badge variant="default">Waiting for payment</Badge>
    if (drop.status === "ACTIVE") return <Badge variant="success">Active</Badge>
    return null
  }

  return (
    <div className="max-w-screen-md mx-auto rounded-2xl bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <Typography as="h6" level="body2" className="font-bold">
          Drop information
        </Typography>
        {dropStatus()}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Number of NFTs
          </Typography>
          <Typography className="font-bold" level="body4">
            {drop.amount}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Method
          </Typography>
          <Typography className="font-bold" level="body4">
            {drop.method}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Mint website
          </Typography>
          <a href={`${APP_BASE_URL}/claim/${method.slug}`} target="_blank" rel="noreferer">
            <Typography className="font-bold underline" level="body4">
              {`/claim/${method.slug}`}
            </Typography>
          </a>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Start at
          </Typography>
          <Typography className="font-bold" level="body4">
            {method.startAt ? dayjs(method.startAt).format("DD/MM/YYYY hh:mm") : "-"}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            End at
          </Typography>
          <Typography className="font-bold" level="body4">
            {method.endAt ? dayjs(method.endAt).format("DD/MM/YYYY hh:mm") : "-"}
          </Typography>
        </div>
      </div>

      <Separator className="my-6" />
      {/* <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Owner</th>
            <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">Mint Date</th>
            <th className="border-b px-4 pb-4 text-left font-medium text-gray-500">NFT</th>
          </tr>
        </thead>
        <tbody>
          {claims?.map((claim) => (
            <tr key={claim.id}>
              <td className="line-clamp-1 p-4">{claim.owner ? truncate(claim.owner ?? "", 8, true) : claim.email}</td>
              <td className="p-4">{dayjs(claim.claimAt).format("DD/MM/YYYY")}</td>
              <td className="p-4">
                <a
                  href={`https://translator.shyft.to/address/${claim.nftAddress}?cluster=devnet&compressed=true`}
                  className="line-clamp-1 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {truncate(claim.nftAddress ?? "", 8, true)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  )
}
