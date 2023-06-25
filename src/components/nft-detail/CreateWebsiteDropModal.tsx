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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/Formv2"
import { Input } from "../ui/Input"
import { NFTMetadata } from "@/types/schema"
import { client } from "@/libs/api"
import { useWallet } from "@solana/wallet-adapter-react"
import dynamic from "next/dynamic"
import { useToast } from "../ui/Toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip"
import { Typography } from "../ui/Typography"
import { HelpCircleIcon } from "lucide-react"
import { Checkbox } from "../ui/Checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"
import { slugify } from "@/utils/slugify"

const WalletMultiButton = dynamic(import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton))

type CreateWebsiteDropModalProps = {
  trigger: React.ReactNode
  nft: NFTMetadata
}

const schema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "This field is required.",
    })
    .min(1, "Amount must greater than 0.")
    .max(1000, "Amount must not exceed 1000."),
  suffix: z.string().trim().min(1, "This field is required."),
  // .refine(
  //   async (value) => {
  //     try {
  //       if (!value) return "This field is required."

  //       const response = await client.checkDropSuffix(value)
  //       return !response
  //     } catch (error) {
  //       return true
  //     }
  //   },
  //   {
  //     message: "The suffix already exists.",
  //   }
  // )
  startDate: z.string().refine(dayjs, { message: "Not a date." }),
  noStartDate: z.boolean().optional(),
  endDate: z.string().refine(dayjs, { message: "Not a date." }),
  noEndDate: z.boolean().optional(),
})

export const CreateWebsiteDropModal = ({ trigger, nft }: CreateWebsiteDropModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: "",
      endDate: "",
      suffix: "",
    },
  })
  const { handleSubmit, watch, control, formState } = methods
  const wSuffix = watch("suffix")
  const noStartDate = watch("noStartDate")
  const noEndDate = watch("noEndDate")

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      console.log("values", values)
      if (!publicKey) return

      // const response = await client.createDrop({
      //   nftId: nft.id,
      //   amount: values.amount,
      //   method: "WEBSITE",
      //   suffix: values.suffix,
      //   payer: publicKey.toBase58(),
      //   signature: "no",
      //   // @ts-ignore
      //   callbackId: new Date().getTime(),
      // })
      // console.log(response)
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message?.toString() || "Server error",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth="lg">
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle
                onClick={() => {
                  toast({
                    variant: "error",
                    title: "Server error",
                  })
                }}
              >
                NFT Drops Website
              </DialogTitle>
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
                name="suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Suffix</FormLabel>
                    <FormControl>
                      <Input step={1} fullWidth placeholder="my-awesome-drop" {...field} />
                    </FormControl>
                    <FormMessage />
                    {wSuffix && <FormDescription>{`${window.location.hostname}/${slugify(wSuffix)}`}</FormDescription>}
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel aria-disabled={noStartDate} className="flex items-center gap-1">
                        Start at
                        <Tooltip>
                          <TooltipTrigger disabled={noStartDate} asChild>
                            <HelpCircleIcon aria-hidden="true" className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <Typography>The time when participants can start minting the NFT.</Typography>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          fullWidth
                          disabled={noStartDate}
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
                  name="noStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: CheckedState) => field.onChange(checked)}
                          color="primary"
                          {...field}
                        >
                          Start now
                        </Checkbox>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="basis-2/3">
                      <FormLabel className="flex items-center gap-1">
                        End at
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircleIcon aria-hidden="true" className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <Typography>The time when participants can start minting the NFT.</Typography>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={noEndDate}
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

                <FormField
                  control={control}
                  name="noEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: CheckedState) => field.onChange(checked)}
                          color="primary"
                          {...field}
                        >
                          No limit
                        </Checkbox>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
