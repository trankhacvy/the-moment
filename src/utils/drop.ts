import { DropDto } from "@/types/apis"

export const getLabelByStatus = (method: DropDto["status"]) => {
  switch (method) {
    case "WAITING_FOR_PAYMENT":
      return {
        label: "Pending",
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
