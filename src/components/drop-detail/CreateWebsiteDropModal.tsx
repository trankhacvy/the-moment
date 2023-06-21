import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import dayjs from "dayjs"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/Formv2"
import { Input } from "../ui/Input"
import { NFTMetadata } from "@/types/schema"
import { client } from "@/libs/api"
import { useWallet } from "@solana/wallet-adapter-react"
import dynamic from "next/dynamic"

const WalletMultiButton = dynamic(import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton))

type CreateWebsiteDropModalProps = {
  trigger: React.ReactNode
  nft: NFTMetadata
}

const schema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Amount must greater than 0")
    .max(2 ** 14, "To big"),
  sufix: z.string(),
  startDate: z.string().refine(dayjs, { message: "Not a date" }),
  endDate: z.string().refine(dayjs, { message: "Not a date" }),
})

export const CreateWebsiteDropModal = ({ trigger, nft }: CreateWebsiteDropModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { connected, publicKey } = useWallet()

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
      const txStr = await client.getCreateDropTransaction({
        nftId: nft.id,
        amount: values.amount,
        publicKey: "",
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth="lg">
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>NFT Drops Website</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of NFTs</FormLabel>
                    <FormControl>
                      <Input fullWidth placeholder="Number of NFTs" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="sufix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Suffix</FormLabel>
                    <FormControl>
                      <Input step={1} fullWidth placeholder="my-awesome-drop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Start at</FormLabel>
                    <FormControl>
                      <Input
                        fullWidth
                        placeholder="Start mint date"
                        type="datetime-local"
                        min={dayjs().format("YYYY-MM-DD HH:MM")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>End at</FormLabel>
                    <FormControl>
                      <Input
                        fullWidth
                        placeholder="End mint date"
                        type="datetime-local"
                        min={dayjs().format("YYYY-MM-DD HH:MM")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {connected && publicKey ? (
                <Button loading={formState.isSubmitting} type="submit">
                  Create
                </Button>
              ) : (
                <WalletMultiButton />
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
