import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Uploader } from "@/components/ui/Uploader"
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Formv2"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { Input } from "../ui/Input"
import { PlusIcon, TrashIcon } from "lucide-react"
import { IconButton } from "../ui/IconButton"
import { Supabase, uploadFile } from "@/libs/supabase"
import { client } from "@/libs/api"
import { Checkbox } from "../ui/Checkbox"
import dayjs from "dayjs"

const formSchema = z.object({
  // drop: z
  //   .object({
  //     amount: z.coerce
  //       .number({ required_error: "This field is required.", invalid_type_error: "This field is required." })
  //       .min(1, "Number of NFTs must be greater than 0")
  //       .max(1000, "Number of NFTs must not exceed 1000."),
  //     startDate: z.string().optional(),
  //     startWhenPublish: z.boolean().optional(),
  //     endDate: z.string().optional(),
  //     noEndDate: z.boolean().optional(),
  //     method: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
  //   })
  //   .refine(
  //     (data) => {
  //       return data.startDate || data.startWhenPublish
  //     },
  //     {
  //       path: ["startDate"],
  //       message: "Please select a date.",
  //     }
  //   )
  //   .refine(
  //     (data) => {
  //       return data.endDate || data.noEndDate
  //     },
  //     {
  //       path: ["endDate"],
  //       message: "Please select a date.",
  //     }
  //   )
  //   .refine(
  //     (data) => {
  //       return data.startWhenPublish || (data.startDate && dayjs(data.startDate).isAfter(dayjs()))
  //     },
  //     {
  //       path: ["startDate"],
  //       message: "Invalid date: Please select a future date.",
  //     }
  //   )
  //   .refine(
  //     (data) => {
  //       return data.noEndDate || (data.endDate && dayjs(data.endDate).isAfter(dayjs()))
  //     },
  //     {
  //       path: ["endDate"],
  //       message: "Invalid date: Please select a future date.",
  //     }
  //   )
  //   .refine(
  //     (data) => {
  //       return (
  //         data.startWhenPublish ||
  //         data.noEndDate ||
  //         (data.startDate && data.endDate && dayjs(data.startDate).isBefore(dayjs(data.endDate)))
  //       )
  //     },
  //     {
  //       path: ["endDate"],
  //       message: "Invalid End Date: Please choose a date that is after the start date.",
  //     }
  //   ),
  nft: z.object({
    image: z.custom<{ name: string }>((value) => value, "This field is required."),
    name: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
    symbol: z.string().optional(),
    externalUrl: z.string().optional(),
    description: z.string().optional(),
    collectionAddress: z.string().optional(),
    attrs: z
      .array(
        z.object({
          name: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
          value: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
        })
      )
      .optional(),
  }),
})

export const NewNFTDropForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      const uploadResult = await uploadFile(
        Supabase,
        `${values.nft.image.name}-${new Date().getTime()}`,
        values.nft.image as any
      )
      // const res = await client.createNFTDrop({
      //   amount: values.drop.amount,
      //   startAt: values.drop.startDate,
      //   endAt: values.drop.endDate,
      //   distributionMethod: values.drop.method,
      //   nft: {
      //     ...values.nft,
      //     image: uploadResult.data?.publicUrl ?? "",
      //   },
      // })

      await client.createNFT({
        ...values.nft,
        image: uploadResult.data?.publicUrl ?? "",
        attributes:
          values.nft.attrs?.map((item) => ({
            traitType: item.name,
            value: item.value,
          })) ?? [],
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-x-6 gap-y-8">
        {/* <DropForm /> */}
        <NFTForm />

        <div className="col-span-2 col-start-2 flex justify-end">
          <Button type="submit" loading={form.formState.isSubmitting}>
            Create drop
          </Button>
        </div>
      </form>
    </Form>
  )
}

// const DropForm = () => {
//   const { control, watch } = useFormContext<z.infer<typeof formSchema>>()
//   const wStartDate = watch("drop.startDate")
//   const wStartWhenPublish = watch("drop.startWhenPublish")
//   const wNoEndDate = watch("drop.noEndDate")

//   return (
//     <>
//       <div className="col-span-1">
//         <Typography level="body2" as="h6" className="mb-1 font-bold">
//           Drop detail
//         </Typography>
//         <Typography level="body4" color="secondary">
//           Total NFTs, mint window time
//         </Typography>
//       </div>
//       <div className="relative col-span-2 flex flex-col gap-6 rounded-2xl p-6 shadow-card">
//         <FormField
//           control={control}
//           name="drop.amount"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Number of NFTs</FormLabel>
//               <FormControl>
//                 <Input fullWidth placeholder="Number of NFTs" type="number" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex items-center gap-6">
//           <FormField
//             control={control}
//             name="drop.startDate"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormLabel>Start at</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={wStartWhenPublish}
//                     fullWidth
//                     placeholder="Start mint date"
//                     type="datetime-local"
//                     min={dayjs().format("YYYY-MM-DD HH:MM")}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={control}
//             name="drop.startWhenPublish"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>&nbsp;</FormLabel>
//                 <FormControl>
//                   {/* @ts-ignore */}
//                   <Checkbox {...field} color="primary" checked={field.value} onCheckedChange={field.onChange}>
//                     When drop publish
//                   </Checkbox>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="flex items-center gap-6">
//           <FormField
//             control={control}
//             name="drop.endDate"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormLabel>Close at</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={wNoEndDate}
//                     fullWidth
//                     placeholder="Close mint date"
//                     type="datetime-local"
//                     min={wStartDate ? dayjs(wStartDate).format("YYYY-MM-DD HH:MM") : undefined}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={control}
//             name="drop.noEndDate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>&nbsp;</FormLabel>
//                 <FormControl>
//                   {/* @ts-ignore */}
//                   <Checkbox {...field} color="primary" checked={field.value} onCheckedChange={field.onChange}>
//                     No limit
//                   </Checkbox>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={control}
//           name="drop.method"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Distribution method</FormLabel>
//               <FormControl>
//                 <Input fullWidth placeholder="Method" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </>
//   )
// }

const NFTForm = () => {
  const { control } = useFormContext<z.infer<typeof formSchema>>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nft.attrs",
  })

  return (
    <>
      <div className="col-span-1">
        <Typography level="body2" as="h6" className="mb-1 font-bold">
          NFT
        </Typography>
        <Typography level="body4" color="secondary">
          NFT Metadata
        </Typography>
      </div>

      <div className="relative col-span-2 flex flex-col items-start justify-start gap-6 rounded-2xl p-6 shadow-card">
        <FormField
          control={control}
          name="nft.image"
          render={({ field }) => (
            <FormItem className="w-full max-w-xs">
              <AspectRatio ratio={1 / 1}>
                <Uploader
                  {...field}
                  className="h-full"
                  maxFiles={1}
                  onChange={(files) => {
                    field.onChange(files?.[0])
                  }}
                />
              </AspectRatio>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nft.name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input fullWidth placeholder="NFT Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nft.description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input as="textarea" rows={6} fullWidth placeholder="NFT Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nft.symbol"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input fullWidth placeholder="Symbol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nft.externalUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>External URL</FormLabel>
              <FormControl>
                <Input fullWidth placeholder="External URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nft.collectionAddress"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Collection address</FormLabel>
              <FormControl>
                <Input fullWidth placeholder="Collection address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((field, index) => (
          <div className="flex w-full items-center gap-6" key={field.id}>
            <FormField
              control={control}
              name={`nft.attrs.${index}.name`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input fullWidth placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`nft.attrs.${index}.value`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input fullWidth placeholder="Value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <IconButton
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                remove(index)
              }}
              className="shrink-0 self-end"
            >
              <TrashIcon />
            </IconButton>
          </div>
        ))}

        <Button
          onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            append({ name: "", value: "" })
          }}
          variant="outline"
          size="sm"
          endDecorator={<PlusIcon />}
        >
          Add attributes
        </Button>
      </div>
    </>
  )
}
