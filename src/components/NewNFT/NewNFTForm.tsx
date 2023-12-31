import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Uploader } from "@/components/ui/Uploader"
import { useFieldArray, useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Formv2"
import { Button } from "@/components/ui/Button"
import { Input } from "../ui/Input"
import { PlusIcon, TrashIcon } from "lucide-react"
import { IconButton } from "../ui/IconButton"
import { Supabase, uploadFile } from "@/libs/supabase"
import { client } from "@/libs/api"
import { useToast } from "../ui/Toast"
import { useRouter } from "next/router"
import { MAX_FILE_SIZE } from "@/config/image"
import { NftDto } from "@/types/apis"
import { useEffect } from "react"
import { Routes } from "@/config/routes"

const MAX_NAME_LENGTH = 32
const MAX_SYMBOL_LENGTH = 10
const MAX_DESCRIPTION_LENGTH = 1000
const MAX_URL_LENGTH = 256

const formSchema = z.object({
  image: z.any().refine((file) => !!file, "Image is required."),
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(MAX_NAME_LENGTH, `The maximum allowed length for this field is ${MAX_NAME_LENGTH} characters`),
  symbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(MAX_SYMBOL_LENGTH, `The maximum allowed length for this field is ${MAX_SYMBOL_LENGTH} characters`),
  externalUrl: z
    .string()
    .trim()
    .max(MAX_URL_LENGTH, `The maximum allowed length for this field is ${MAX_URL_LENGTH} characters`)
    .optional(),
  description: z
    .string()
    .trim()
    .max(MAX_DESCRIPTION_LENGTH, `The maximum allowed length for this field is ${MAX_DESCRIPTION_LENGTH} characters`)
    .optional(),
  attributes: z
    .array(
      z.object({
        name: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(10, `The maximum allowed length for this field is ${10} characters`),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(32, `The maximum allowed length for this field is ${32} characters`),
      })
    )
    .optional(),
})

type NewNFTFormProps = {
  isEdit?: boolean
  nft?: NftDto
}

export const NewNFTForm = ({ isEdit = false, nft }: NewNFTFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      symbol: "",
      externalUrl: "",
      attributes: [],
    },
  })

  const { control, setError } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  })

  const { replace } = useRouter()
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { attributes, ...rest } = values
      const formData = new FormData()
      Object.keys(rest).map((key) => {
        // @ts-ignore
        formData.append(key, rest[key])
      })
      const attrs =
        attributes?.map((item) => ({
          traitType: item.name,
          value: item.value,
        })) ?? []

      attrs.forEach((attr, idx) => {
        formData.append(`attributes[${idx}][traitType]`, attr.traitType)
        formData.append(`attributes[${idx}][value]`, attr.value)
      })

      const response = isEdit ? await client.updateNFT(nft?.id ?? "", formData) : await client.createNFT(formData)

      toast({
        variant: "success",
        title: isEdit ? "NFT successfully updated" : "NFT successfully created",
      })
      replace(Routes.NFT_DETAIL(response.id))
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message || "Server error",
      })
    }
  }

  useEffect(() => {
    if (isEdit && nft) {
      form.reset({
        name: nft.name,
        symbol: nft.symbol,
        externalUrl: nft.externalUrl ?? "",
        description: nft.description ?? "",
        image: nft.image ?? "",
        attributes: ((nft.attributes as Array<{ traitType: string; value: string }>) ?? []).map((item) => ({
          name: item.traitType,
          value: item.value,
        })),
      })
    }
  }, [isEdit, nft])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-screen-md mx-auto">
        <div className="w-full flex flex-col items-start justify-start gap-6 rounded-2xl p-6 shadow-card bg-white">
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full max-w-xs">
                <AspectRatio ratio={1 / 1}>
                  <Uploader
                    {...field}
                    className="h-full"
                    maxFiles={1}
                    maxSize={MAX_FILE_SIZE}
                    accept={{
                      "image/png": [".png"],
                      "image/jpeg": [".jpg", ".jpeg"],
                    }}
                    onExceedFileSize={() => setError("image", { message: "Max file size is 5MB" })}
                    value={field.value ? [field.value] : []}
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
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input fullWidth placeholder="Enter the NFT name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    as="textarea"
                    rows={6}
                    fullWidth
                    placeholder="Provide a brief description of the NFT (optional)..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="symbol"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input fullWidth placeholder="Enter the symbol for your NFT..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="externalUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>External URL</FormLabel>
                <FormControl>
                  <Input fullWidth placeholder="Add an external URL (optional)..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div className="flex w-full items-center gap-6" key={field.id}>
              <FormField
                control={control}
                name={`attributes.${index}.name`}
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
                name={`attributes.${index}.value`}
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
            variant="link"
            color="primary"
            size="sm"
            endDecorator={<PlusIcon />}
          >
            Add attributes
          </Button>
        </div>
        <div className="flex flex-col items-end justify-end mt-10">
          <Button type="submit" loading={form.formState.isSubmitting}>
            {isEdit ? "Edit NFT" : "Create NFT"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// const NFTForm = () => {
//   const { control, setError } = useFormContext<z.infer<typeof formSchema>>()

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "attributes",
//   })

//   return (
//     <>
//       <div className="col-span-1">
//         <Typography level="body2" as="h6" className="mb-1 font-bold">
//           NFT
//         </Typography>
//         <Typography level="body4" color="secondary">
//           NFT Metadata
//         </Typography>
//       </div>

//       <div className="relative col-span-3 flex flex-col items-start justify-start gap-6 rounded-2xl p-6 shadow-card">
//         <FormField
//           control={control}
//           name="image"
//           render={({ field }) => (
//             <FormItem className="w-full max-w-xs">
//               <AspectRatio ratio={1 / 1}>
//                 <Uploader
//                   {...field}
//                   className="h-full"
//                   maxFiles={1}
//                   maxSize={MAX_FILE_SIZE}
//                   accept={{
//                     "image/png": [".png"],
//                     "image/jpeg": [".jpg", ".jpeg"],
//                   }}
//                   onExceedFileSize={() => setError("image", { message: "Max file size is 5MB" })}
//                   value={field.value ? [field.value] : []}
//                   onChange={(files) => {
//                     field.onChange(files?.[0])
//                   }}
//                 />
//               </AspectRatio>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="name"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input fullWidth placeholder="NFT Name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="description"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Input as="textarea" rows={6} fullWidth placeholder="NFT Description" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="symbol"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Symbol</FormLabel>
//               <FormControl>
//                 <Input fullWidth placeholder="Symbol" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={control}
//           name="externalUrl"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>External URL</FormLabel>
//               <FormControl>
//                 <Input fullWidth placeholder="External URL" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {fields.map((field, index) => (
//           <div className="flex w-full items-center gap-6" key={field.id}>
//             <FormField
//               control={control}
//               name={`attributes.${index}.name`}
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input fullWidth placeholder="Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={control}
//               name={`attributes.${index}.value`}
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Value</FormLabel>
//                   <FormControl>
//                     <Input fullWidth placeholder="Value" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <IconButton
//               onClick={(event) => {
//                 event.stopPropagation()
//                 event.preventDefault()
//                 remove(index)
//               }}
//               className="shrink-0 self-end"
//             >
//               <TrashIcon />
//             </IconButton>
//           </div>
//         ))}

//         <Button
//           onClick={(event) => {
//             event.stopPropagation()
//             event.preventDefault()
//             append({ name: "", value: "" })
//           }}
//           variant="outline"
//           size="sm"
//           endDecorator={<PlusIcon />}
//         >
//           Add attributes
//         </Button>
//       </div>
//     </>
//   )
// }
