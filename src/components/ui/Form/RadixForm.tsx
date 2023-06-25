import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form"

const Form = FormProvider

const FormController = Controller

// type FormControlContextValue = any

// const FormControlContext = React.createContext<FormControlContextValue>({})

// export const FormControlV1 = React.forwardRef<HTMLDivElement, FormControlProps>((props, ref) => {
//   const { id: idProp, required, disabled, error, className, ...rest } = props
//   const internalId = useId()
//   const id = idProp ?? internalId

//   const contextValue = {
//     disabled,
//     required,
//     error,
//     htmlFor: id,
//     labelId: `${id}-label`,
//   }

//   return (
//     <FormControlContext.Provider value={contextValue}>
//       <div ref={ref} className={cn("relative inline-flex flex-col", className)} {...rest} />
//     </FormControlContext.Provider>
//   )
// })

export { Form, FormController }
