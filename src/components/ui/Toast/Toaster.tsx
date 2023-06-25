import { Alert, AlertTitle, AlertDescription, AlertIcon, AlertClose } from "@/components/ui/Alert"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X, CheckIcon, AlertTriangleIcon, AlertOctagonIcon, AlertCircleIcon } from "lucide-react"
import { Toast, ToastProvider, ToastViewport } from "./Toast"
import { useToast } from "./useToast"
import { IconButton } from "../IconButton"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props}>
            <Alert variant={variant}>
              <AlertIcon>
                {variant === "info" && <AlertCircleIcon />}
                {variant === "success" && <CheckIcon />}
                {variant === "warning" && <AlertTriangleIcon />}
                {variant === "error" && <AlertOctagonIcon />}
              </AlertIcon>
              <div className="flex-1">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
              </div>
              <ToastPrimitives.Close>
                <X />
                {/* <AlertClose>
                  <IconButton size="sm">
                    <X />
                  </IconButton>
                </AlertClose> */}
              </ToastPrimitives.Close>
            </Alert>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
