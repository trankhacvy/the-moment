import { Typography } from "@/components/ui/Typography"
import * as z from "zod"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Alert, AlertTitle, AlertDescription, AlertIcon } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { IconButton } from "../ui/IconButton"
import { FileQuestionIcon, XIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Duration, newMintWebsiteSchema } from "./NewMintWebsiteForm"
import dayjs from "dayjs"
import { NFT_PRICE } from "@/config/common"
import { APP_BASE_URL } from "@/config/env"

type CreateDropConfirmModalProps = {
  //   trigger: React.ReactNode
  onSubmit: any
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const CreateDropConfirmModal = ({ isOpen, onOpenChange, onSubmit }: CreateDropConfirmModalProps) => {
  const { watch, handleSubmit, formState } = useFormContext<z.infer<typeof newMintWebsiteSchema>>()

  const amount = watch("amount")
  const startDate = watch("startDate")
  const duration = watch("duration")
  let endDate = watch("endDate")
  const suffix = watch("suffix")

  if (startDate) {
    if (duration === Duration.TEN_MIN) {
      endDate = dayjs(startDate).add(10, "minutes").toISOString()
    } else if (duration === Duration.THIRTY_MIN) {
      endDate = dayjs(startDate).add(30, "minutes").toISOString()
    } else if (duration === Duration.ONE_HOUR) {
      endDate = dayjs(startDate).add(1, "hour").toISOString()
    }
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        {/* <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> */}
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Create confirmation</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography color="secondary" level="body4">
                Number of NFTs
              </Typography>
              <Typography className="font-bold" level="body4">
                {amount}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography color="secondary" level="body4">
                Mint website
              </Typography>
              <Typography className="font-bold underline" level="body4">
                {`${APP_BASE_URL}/claim/${suffix}`}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography color="secondary" level="body4">
                Start at
              </Typography>
              <Typography className="font-bold" level="body4">
                {startDate ? dayjs(startDate).format("DD/MM/YYYY hh:mm") : "-"}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography color="secondary" level="body4">
                End at
              </Typography>
              <Typography className="font-bold" level="body4">
                {endDate ? dayjs(endDate).format("DD/MM/YYYY hh:mm") : "-"}
              </Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography color="secondary" level="body4">
                Cost est
              </Typography>
              <Typography color="primary" className="font-bold" level="body4">
                {NFT_PRICE * amount} SOL
              </Typography>
            </div>
          </AlertDialogDescription>

          <Alert variant="error">
            <AlertIcon>
              <FileQuestionIcon />
            </AlertIcon>
            <div>
              <AlertTitle>Remember!</AlertTitle>
              <AlertDescription>Once a drop is created, it cannot be withdrawn</AlertDescription>
            </div>
          </Alert>

          <AlertDialogFooter>
            <Button onClick={handleSubmit(onSubmit)} loading={formState.isSubmitting} fullWidth>
              Create new drop
            </Button>
          </AlertDialogFooter>
          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 shadow-none hover:bg-gray-800/8 focus:ring-0"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </IconButton>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
