import { Typography } from "../ui/Typography"
import { DropDto } from "@/types/apis"
import { Badge } from "../ui/badge"

type DropItemProps = {
  drop: DropDto
}

const getDropTitleByMethod = (method: DropDto["method"]) => {
  switch (method) {
    case "WEBSITE":
      return "Website"
    case "MINT_LINK":
      return "Mint links"
    case "WHITELIST":
      return "Whitelists"
    case "SECRET":
      return "Secret"
    default:
      return ""
  }
}

const getLabelByStatus = (method: DropDto["status"]) => {
  switch (method) {
    case "WAITING_FOR_PAYMENT":
      return {
        label: "Processing",
        variant: "info",
      }
    case "PAYMENT_FAILED":
      return {
        label: "Payment failed",
        variant: "error",
      }
    case "PROCESSING":
      return {
        label: "Processing",
        variant: "info",
      }
    case "ACTIVE":
      return {
        label: "Active",
        variant: "success",
      }
    case "ENDED":
      return {
        label: "Ended",
        variant: "default",
      }
  }
}

export const DropItemV1 = ({ drop }: DropItemProps) => {
  const statusLabel = getLabelByStatus(drop.status)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <Typography as="h6" level="body2" className="font-bold">
        {getDropTitleByMethod(drop.method)}
      </Typography>
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
            Status
          </Typography>
          <Badge color={statusLabel.variant}>{statusLabel.label}</Badge>
        </div>
      </div>
    </div>
  )
}
