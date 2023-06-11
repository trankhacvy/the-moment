import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { NextPageContext } from "next"
import { getServerSession } from "next-auth/next"
import { ReactElement } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { AspectRatio } from "@/components/AspectRatio"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Typography } from "@/components/Typography"
import { FormControl, FormHelperText, FormLabel } from "@/components/Form"
import { Uploader } from "@/components/Uploader"
import { authOptions } from "@/utils/authOptions"
import { Input } from "@/components/Input"
import { Checkbox } from "@/components/Checkbox"
import { Radio, RadioGroup } from "@/components/Radio"
import { Button } from "@/components/Button"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Transaction } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Supabase, uploadFile } from "@/libs/supabase"
import { useRouter } from "next/router"
import { useToast } from "@/components/Toast"
import { PlusIcon, TrashIcon } from "lucide-react"
import { IconButton } from "@/components/IconButton"
import { Database } from "@/types/supabase.types"

// @ts-ignore
const schema = z.object({
  drop: z.object({
    amount: z.coerce
      .number()
      .min(1, "Amount must greater than 0")
      .max(2 ** 14, "To big"),
    startDate: z.string(),
    endDate: z.string(),
  }),
  nft: z.object({
    image: z.custom<{ name: string }>((value) => value, "Image is required"),
    name: z.string().trim().min(1, "Name is required"),
    symbol: z.string().trim().min(1, "Symbol is required"),
    description: z.string(),
    transferable: z.boolean(),
    nftPerWallet: z.coerce.number(),
    attrs: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    ),
  }),
})

const CreatePage = ({ event }: { event: Database["public"]["Tables"]["poap_events"]["Row"] }) => {
  const { data: session } = useSession()
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()
  const { query, replace } = useRouter()
  const eventId = query.eventId as string
  const { toast } = useToast()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      drop: {
        amount: 0,
        startDate: "",
        endDate: "",
      },
      nft: {
        name: event.name ?? "",
        symbol: "POAP",
        description: event.description ?? "",
        transferable: false,
        nftPerWallet: 1,
      },
    },
  })

  const { handleSubmit, formState } = methods

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      console.log(values)
      // upload images
      const uploadResult = await uploadFile(
        Supabase,
        `${session?.address}/${new Date().getTime()}-${values.nft.image.name}`,
        values.nft.image as File
      )
      console.log("uploadResult", uploadResult)

      const response = await axios.post<any>("/api/create-drop-transaction", {
        amount: values.drop.amount,
        creator: session?.address!,
      })

      if (response.status === 200 && response.data.success) {
        const transaction = Transaction.from(Buffer.from(response.data?.data?.encoded_transaction ?? "", "base64"))
        console.log("transaction", transaction)
        const signature = await sendTransaction(transaction, connection)
        await connection.confirmTransaction(signature, "processed")
        console.log("signature", signature)

        const cdResponse = await axios.post<any>("/api/create-drop", {
          owner: session?.address!,
          eventDrop: {
            eventId: eventId,
            amount: values.drop.amount,
            startDate: values.drop.startDate,
            endDate: values.drop.endDate,
            treeAddress: response.data?.data?.tree,
          },
          nft: {
            name: values.nft.name,
            symbol: values.nft.symbol,
            description: values.nft.description,
            image: uploadResult.data?.publicUrl,
            transferable: values.nft.transferable,
            nftPerWallet: values.nft.nftPerWallet,
            attrs: values.nft.attrs,
          },
        })

        console.log("cdResponse", cdResponse)
        if (cdResponse.status === 200) {
          toast({
            title: "Success",
            description: "Your drop is successfully created",
          })
          replace(`/dashboard/${eventId}`)
        }
      }

      // const cdResponse = await axios.post<any>("/api/create-drop", {
      //   owner: session?.address!,
      //   eventDrop: {
      //     eventId: eventId,
      //     amount: values.drop.amount,
      //     startDate: values.drop.startDate,
      //     endDate: values.drop.endDate,
      //     treeAddress: 'response.data?.data?.tree',
      //   },
      //   nft: {
      //     name: values.nft.name,
      //     symbol: values.nft.symbol,
      //     description: values.nft.description,
      //     image: uploadResult.data?.publicUrl,
      //     transferable: values.nft.transferable,
      //     nftPerWallet: values.nft.nftPerWallet,
      //     attrs: values.nft.attrs,
      //   },
      // })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create your drop
        </Typography>
        <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <a href="/">
            <Typography as="span" level="body4">
              Dashboard
            </Typography>
          </a>
          <Typography as="span" level="body4" color="secondary">
            Create
          </Typography>
        </Breadcrumbs>
      </div>
      {/* form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            <div className="col-span-1">
              <Typography level="body2" as="h6" className="mb-1 font-bold">
                Drop detail
              </Typography>
              <Typography level="body4" color="secondary">
                Total NFTs, mint window time
              </Typography>
            </div>
            <EventDropForm />
            {/* nft form */}
            <div className="col-span-1">
              <Typography level="body2" as="h6" className="mb-1 font-bold">
                NFT
              </Typography>
              <Typography level="body4" color="secondary">
                NFT Metadata
              </Typography>
            </div>
            <NftForm />

            <div className="col-span-2 col-start-2 flex justify-end">
              <Button type="submit" loading={formState.isSubmitting}>
                Create drop
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

const EventDropForm = () => {
  const { control } = useFormContext<z.infer<typeof schema>>()

  return (
    <div className="relative col-span-2 flex flex-col gap-6 rounded-2xl p-6 shadow-card">
      <Controller
        name="drop.amount"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl className="w-full" required error={fieldState.invalid}>
            <FormLabel>Number of NFTs</FormLabel>
            <Input fullWidth placeholder="e.g. 1000" type="number" {...field} />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <FormControl>
        <FormLabel>Mint window</FormLabel>
        <div className="flex gap-6">
          <Controller
            name="drop.startDate"
            control={control}
            render={({ field }) => <Input fullWidth placeholder="Start at" type="datetime-local" {...field} />}
          />

          <Controller
            name="drop.endDate"
            control={control}
            render={({ field }) => <Input fullWidth placeholder="End at" type="datetime-local" {...field} />}
          />
        </div>
      </FormControl>
    </div>
  )
}

const NftForm = () => {
  const { control } = useFormContext<z.infer<typeof schema>>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "nft.attrs",
  })

  return (
    <div className="relative col-span-2 flex flex-col items-start justify-start gap-6 rounded-2xl p-6 shadow-card">
      <div className="w-full max-w-sm">
        <AspectRatio ratio={1 / 1}>
          <Controller
            name="nft.image"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="h-full w-full" error={fieldState.invalid}>
                <Uploader
                  {...field}
                  className="h-full"
                  maxFiles={1}
                  onChange={(files) => {
                    field.onChange(files?.[0])
                  }}
                />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </AspectRatio>
      </div>

      <Controller
        name="nft.name"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl className="w-full" required error={fieldState.invalid}>
            <FormLabel>Name</FormLabel>
            <Input fullWidth placeholder="Name" {...field} />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="nft.symbol"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl className="w-full" required error={fieldState.invalid}>
            <FormLabel>Symbol</FormLabel>
            <Input fullWidth placeholder="Symbol" {...field} />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="nft.description"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl className="w-full" error={fieldState.invalid}>
            <FormLabel>Description</FormLabel>
            <Input as="textarea" rows={6} fullWidth placeholder="Description" {...field} />
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {fields.map((field, index) => (
        <div className="flex w-full items-center gap-6" key={field.id}>
          <Controller
            name={`nft.attrs.${index}.name`}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="flex-1" error={fieldState.invalid}>
                <FormLabel>Name</FormLabel>
                <Input fullWidth placeholder="Name" {...field} />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name={`nft.attrs.${index}.value`}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="flex-1" error={fieldState.invalid}>
                <FormLabel>Value</FormLabel>
                <Input fullWidth placeholder="Value" {...field} />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <IconButton
            onClick={(event) => {
              event.stopPropagation()
              event.preventDefault()
              remove(index)
            }}
            className="shrink-0"
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

      <Controller
        name="nft.transferable"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl className="w-full" error={fieldState.invalid}>
            <Checkbox
              {...field}
              value="transferable"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            >
              Transferable
            </Checkbox>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="nft.nftPerWallet"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl className="w-full" error={fieldState.invalid}>
            <FormLabel>NFT per wallet</FormLabel>
            <RadioGroup
              className="flex gap-4"
              {...field}
              value={String(field.value)}
              onValueChange={(value) => field.onChange(value)}
            >
              <Radio value="1">Only one</Radio>
              <Radio value="-1">No limit</Radio>
            </RadioGroup>
            {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </div>
  )
}

CreatePage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export async function getServerSideProps(context: NextPageContext) {
  // @ts-ignore
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const eventId = context.query.eventId
  if (!eventId) {
    return {
      notFound: true,
    }
  }

  const { data, error } = await Supabase.from("poap_events")
    .select("*")
    .eq("id", eventId as string)
    .maybeSingle()

  if (!data || error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      session,
      event: data,
    },
  }
}

export default CreatePage
