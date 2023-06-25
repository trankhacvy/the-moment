import * as React from "react"
import { Alert, type AlertProps } from "./Alert"

export type AlertContextValue = undefined | Pick<AlertProps, "variant">

const AlertContext = React.createContext<AlertContextValue>(undefined)

export default AlertContext
