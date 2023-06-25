import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import dayjs from "dayjs"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/Formv2"
import { Input } from "../ui/Input"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip"
import { Typography } from "../ui/Typography"
import { HelpCircleIcon } from "lucide-react"
import { slugify } from "@/utils/slugify"
import { ToggleGroup, ToggleGroupItem } from "../ui/Toggle"
import { MAX_NFT_AMOUNT, MAX_SUFFIX_LENGTH, MINT_NFT_AMOUNT } from "@/config/validation"
import { CreateNFTDropDto } from "@/types/apis"
import { client } from "@/libs/api"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import dynamic from "next/dynamic"
import { Transaction } from "@solana/web3.js"
import { useToast } from "../ui/Toast"
import { useRouter } from "next/router"
import { Routes } from "@/config/routes"

const WalletMultiButton = dynamic(import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton))

enum Duration {
  TEN_MIN = "10 min",
  THIRTY_MIN = "30 min",
  ONE_HOUR = "1 hour",
  CUSTOM = "Custom",
}

const schema = z
  .object({
    amount: z.coerce
      .number({
        invalid_type_error: "This field is required.",
      })
      .min(MINT_NFT_AMOUNT, `Amount requested must be greater than or equal to ${MINT_NFT_AMOUNT}.`)
      .max(MAX_NFT_AMOUNT, `Amount requested must be less than or equal to ${MAX_NFT_AMOUNT}.`),
    suffix: z.string().trim().min(1, "This field is required.").max(MAX_SUFFIX_LENGTH),
    duration: z.nativeEnum(Duration),
    startDate: z
      .string()
      .refine((value) => dayjs(value).isValid(), { message: "Not a date." })
      .refine((value) => dayjs(value).isAfter(dayjs()), { message: "Please enter a future date." }),
    endDate: z.string().refine(dayjs, { message: "Not a date." }),
  })
  .refine(
    (value) => {
      return value.duration !== Duration.CUSTOM || dayjs(value.startDate).isBefore(dayjs(value.endDate))
    },
    {
      message: "Invalid end time",
      path: ["endDate"],
    }
  )

export const NewMintWebsiteForm = ({ nftId }: { nftId: string }) => {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: "",
      endDate: "",
      suffix: "",
      duration: Duration.TEN_MIN,
    },
  })
  const { handleSubmit, watch, control, formState } = methods
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  const { replace } = useRouter()

  const wSuffix = watch("suffix")
  const wDuration = watch("duration")

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (!publicKey) return

      let endDate = values.endDate
      if (values.duration === Duration.TEN_MIN) {
        endDate = dayjs(values.startDate).add(10, "minutes").toISOString()
      } else if (values.duration === Duration.THIRTY_MIN) {
        endDate = dayjs(values.startDate).add(30, "minutes").toISOString()
      } else if (values.duration === Duration.ONE_HOUR) {
        endDate = dayjs(values.startDate).add(1, "hour").toISOString()
      }

      const txResult = await client.getCreateDropTransaction({
        payer: publicKey.toBase58(),
        nftId,
        amount: values.amount,
        network: "devnet",
      })

      const tx = Transaction.from(Buffer.from(txResult.transaction, "base64"))
      const signature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, "confirmed")

      const body: CreateNFTDropDto = {
        nftId,
        transactionId: txResult.id,
        amount: values.amount,
        method: "WEBSITE",
        suffix: slugify(values.suffix),
        startAt: dayjs(values.startDate).toISOString(),
        endAt: endDate,
        signature,
      }

      await client.createDrop(body)
      replace(Routes.NFT_DETAIL(nftId))
      toast({
        variant: "success",
        title: "Success",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message?.toString() || "Server error",
      })
    }
  }

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg gap-6 rounded-2xl p-6 shadow-card">
        <div className="mb-6 flex flex-col gap-5">
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
                {wSuffix && (
                  <FormDescription className="line-clamp-2">{`${window.location.hostname}/${slugify(
                    wSuffix
                  )}`}</FormDescription>
                )}
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <FormLabel className="flex items-center gap-1">
              Mint window
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircleIcon aria-hidden="true" className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-900 text-white">
                  <Typography>During this time, participants will be able to mint the NFT from the website.</Typography>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            {/* start at */}
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-gray-600">Start at</FormLabel>
                  <FormControl>
                    <Input fullWidth placeholder="Start mint date" type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* duration */}
            <FormField
              control={control}
              name="duration"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-gray-600">Duration</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      className="!flex"
                      type="single"
                      aria-label="Duration"
                      {...field}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <ToggleGroupItem
                        size="sm"
                        variant="outline"
                        value={Duration.TEN_MIN}
                        aria-label={Duration.TEN_MIN}
                      >
                        {Duration.TEN_MIN}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        size="sm"
                        variant="outline"
                        value={Duration.THIRTY_MIN}
                        aria-label={Duration.THIRTY_MIN}
                      >
                        {Duration.THIRTY_MIN}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        size="sm"
                        variant="outline"
                        value={Duration.ONE_HOUR}
                        aria-label={Duration.ONE_HOUR}
                      >
                        {Duration.ONE_HOUR}
                      </ToggleGroupItem>
                      <ToggleGroupItem size="sm" variant="outline" value={Duration.CUSTOM} aria-label={Duration.CUSTOM}>
                        {Duration.CUSTOM}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* end at */}
            {wDuration === Duration.CUSTOM && (
              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel className="text-gray-600">End at</FormLabel>
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
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {/* <Button loading={formState.isSubmitting} type="submit">
            Create
          </Button> */}
          {publicKey ? (
            <Button loading={formState.isSubmitting} type="submit">
              Create
            </Button>
          ) : (
            <WalletMultiButton />
          )}
        </div>
      </form>
    </Form>
  )
}
