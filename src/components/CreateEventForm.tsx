import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { FormControl, FormHelperText, FormLabel } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Supabase, uploadFile } from "@/libs/supabase"
import { Radio, RadioGroup } from "@/components/ui/Radio"

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string(),
  eventType: z.string(),
  location: z.string(),
  virtualEventUrl: z.string(),
  startDate: z.string().refine(dayjs, { message: "Not a date" }),
  endDate: z.string().refine(dayjs, { message: "Not a date" }),
  website: z.string(),
})

export const CreateEventForm = ({ image }: { image?: File }) => {
  const { replace } = useRouter()
  const { data: session } = useSession()

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      eventType: "in_person",
      location: "",
      virtualEventUrl: "",
      startDate: "",
      endDate: "",
      website: "",
    },
  })
  const { handleSubmit, control, watch, formState } = methods
  const wEventType = watch("eventType")

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (!image) return
      const uploadResult = await uploadFile(Supabase, `${session?.address}/${image.name}`, image)

      const { data, error } = await Supabase.from("poap_events")
        .insert({
          name: values.name,
          description: values.description,
          event_type: values.eventType,
          location: values.location,
          virtual_event_url: values.virtualEventUrl,
          website: values.website,
          start_date: values.startDate,
          end_date: values.endDate,
          logo: uploadResult.data?.publicUrl,
          creator: session?.address,
        })
        .select("*")
        .maybeSingle()

      if (error) throw error

      replace(`/dashboard/${data?.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="basis-2/3 space-y-6 rounded-2xl bg-white p-6 shadow-card">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl className="w-full" required error={fieldState.invalid}>
              <FormLabel>Event name</FormLabel>
              <Input fullWidth placeholder="Solana Hackathon" {...field} />
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl className="w-full" error={fieldState.invalid}>
              <FormLabel>Description</FormLabel>
              <Input fullWidth rows={6} placeholder="Your event description" as="textarea" {...field} />
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <Controller
          name="eventType"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl className="w-full" error={fieldState.invalid}>
              <FormLabel>Event type</FormLabel>
              <RadioGroup className="gap-4" {...field} onValueChange={(value) => field.onChange(value)}>
                <Radio value="in_person">In Person</Radio>
                <Radio value="virtual">Virtual</Radio>
              </RadioGroup>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )}
        />

        {wEventType === "in_person" && (
          <Controller
            name="location"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="w-full" error={fieldState.invalid}>
                <FormLabel>Event location</FormLabel>
                <Input fullWidth placeholder="What's the address" {...field} />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        )}

        {wEventType === "virtual" && (
          <Controller
            name="virtualEventUrl"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="w-full" error={fieldState.invalid}>
                <FormLabel>Event URL</FormLabel>
                <Input fullWidth placeholder="What's the event taking place" {...field} />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        )}

        <Controller
          name="website"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl className="w-full" error={fieldState.invalid}>
              <FormLabel>Website</FormLabel>
              <Input fullWidth placeholder="Your event website" {...field} />
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <div className="flex gap-6">
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="w-full" error={fieldState.invalid}>
                <FormLabel>Start date</FormLabel>
                <Input type="datetime-local" fullWidth placeholder="Start event" {...field} />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl className="w-full" error={fieldState.invalid}>
                <FormLabel>End date</FormLabel>
                <Input type="datetime-local" fullWidth placeholder="End event" {...field} />
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button loading={formState.isSubmitting}>Create event</Button>
        </div>
      </form>
    </FormProvider>
  )
}
