import { Typography } from "../ui/Typography"
import { DropDto } from "@/types/apis"
import dayjs from "dayjs"
import { APP_BASE_URL } from "@/config/env"

type DropItemProps = {
  nftDrop: DropDto
}

export const DropItem = ({ nftDrop }: DropItemProps) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <Typography as="h6" level="body2" className="font-bold">
        Drop information
      </Typography>
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Number of NFTs
          </Typography>
          <Typography className="font-bold" level="body4">
            {nftDrop.amount}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Method
          </Typography>
          <Typography className="font-bold" level="body4">
            {nftDrop.method}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Mint website
          </Typography>
          <a href={`${APP_BASE_URL}/claim/${nftDrop.suffix}`} target="_blank" rel="noreferer">
            <Typography className="font-bold underline" level="body4">
              {`/claim/${nftDrop.suffix}`}
            </Typography>
          </a>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            Start at
          </Typography>
          <Typography className="font-bold" level="body4">
            {nftDrop.startAt ? dayjs(nftDrop.startAt).format("DD/MM/YYYY hh:mm") : "-"}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography color="secondary" level="body4">
            End at
          </Typography>
          <Typography className="font-bold" level="body4">
            {nftDrop.endAt ? dayjs(nftDrop.endAt).format("DD/MM/YYYY hh:mm") : "-"}
          </Typography>
        </div>
      </div>
    </div>
  )
}
