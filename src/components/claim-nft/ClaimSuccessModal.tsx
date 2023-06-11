import { Typography } from "@/components/Typography"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/AlertDialog"
import { AspectRatio } from "@/components/AspectRatio"
import { Button } from "../Button"

type ClaimSuccessModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  signature: string
  image: string
}

export const ClaimSuccessModal = ({
  trigger,
  isOpen = false,
  onOpenChange,
  signature,
  image,
}: ClaimSuccessModalProps) => {
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          <AlertDialogDescription>
            <AspectRatio className="overflow-hidden">
              <img className="h-auto w-full rounded-2xl" src={image} />
            </AspectRatio>
          </AlertDialogDescription>
          <AlertDialogFooter className="!flex-col !items-center !justify-center">
            <Typography as="h6" className="font-bold" level="h4">
              Congrats 🎉🎉
            </Typography>
            <Button
              variant="link"
              as="a"
              href={`https://translator.shyft.to/tx/${signature}?cluster=devnet`}
              target="_blank"
            >
              View on Translator
            </Button>
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
