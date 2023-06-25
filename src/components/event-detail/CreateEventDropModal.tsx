import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import dayjs from "dayjs"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { FormControl, FormHelperText, FormLabel } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useSession } from "next-auth/react"
import { Supabase } from "@/libs/supabase"

type CreateEventDropModalProps = {
  trigger: React.ReactNode
  eventId: string
  onSuccess: VoidFunction
}

const schema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Amount must greater than 0")
    .max(2 ** 14, "To big"),
  startDate: z.string().refine(dayjs, { message: "Not a date" }),
  endDate: z.string().refine(dayjs, { message: "Not a date" }),
})

export const CreateEventDropModal = ({ trigger, eventId, onSuccess }: CreateEventDropModalProps) => {
  const { data: session } = useSession()
  const { connection } = useConnection()
  const [isOpen, setIsOpen] = useState(false)
  const { sendTransaction } = useWallet()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      startDate: "",
      endDate: "",
    },
  })
  const { handleSubmit, control, formState } = methods

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      console.log("values", values)
      const response = await axios.post<any>("/api/create-drop", {
        eventId,
        amount: values.amount,
        creator: session?.address!,
        startAt: values.startDate,
        endAt: values.endDate,
      })
      if (response.status === 200 && response.data.success) {
        const transaction = Transaction.from(Buffer.from(response.data?.data?.encoded_transaction ?? "", "base64"))
        console.log("transaction", transaction)
        const signature = await sendTransaction(transaction, connection)
        await connection.confirmTransaction(signature, "processed")
        console.log("signature", signature)
        const { error } = await Supabase.from("poap_event_drops").insert({
          event_id: eventId,
          amount: values.amount,
          start_date: values.startDate,
          end_date: values.endDate,
          tree_address: response.data.data.tree,
          use_email: true,
          use_mint_link: true,
          use_solana_pay: true,
          status: "active",
        })
        if (error) throw error
        onSuccess()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth="lg">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create new drop</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl className="w-full" required error={fieldState.invalid}>
                    <FormLabel>Number of NFTs</FormLabel>
                    <Input fullWidth placeholder="e.g. 1000" type="number" {...field} />
                    {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                  </FormControl>
                )}
                rules={{}}
              />

              <FormControl>
                <FormLabel>Mint window</FormLabel>
                <div className="flex gap-6">
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => <Input fullWidth placeholder="Start at" type="datetime-local" {...field} />}
                  />

                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => <Input fullWidth placeholder="End at" type="datetime-local" {...field} />}
                  />
                </div>
              </FormControl>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button loading={formState.isSubmitting} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
