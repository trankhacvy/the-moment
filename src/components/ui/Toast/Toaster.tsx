import { Alert, AlertTitle, AlertDescription, AlertIcon, AlertClose } from "@/components/ui/Alert"
import * as ToastPrimitives from "@radix-ui/react-toast"
import {
  X,
  CheckIcon,
  AlertTriangleIcon,
  AlertOctagonIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react"
import { Toast, ToastProvider, ToastViewport } from "./Toast"
import { useToast } from "./useToast"
import { cn } from "@/utils/cn"

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
                {variant === "success" && <CheckCircle2Icon />}
                {variant === "warning" && <AlertTriangleIcon />}
                {variant === "error" && <XCircleIcon />}
              </AlertIcon>
              <div
                className={cn("flex-1", {
                  "self-center": !description,
                })}
              >
                <AlertTitle>{title}</AlertTitle>
                {description && <AlertDescription>{description}</AlertDescription>}
              </div>
              <ToastPrimitives.Close>
                <X className="w-4 h-4" />
              </ToastPrimitives.Close>
            </Alert>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
