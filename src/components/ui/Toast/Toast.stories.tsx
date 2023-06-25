import type { Meta, StoryObj } from "@storybook/react"
import { Toast, Toaster, useToast } from "."
import { Button } from "../Button"

const meta = {
  title: "components/Toast",
  component: Toast,
  tags: ["autodocs"],

  decorators: [
    (story) => (
      <div className="">
        {story()}
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>

export default meta

type Story = StoryObj<typeof Toast>

export const Default: Story = {
  render: () => {
    const { toast } = useToast()

    return (
      <Button
        onClick={() =>
          toast({
            variant: "error",
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
            duration: 100000000,
          })
        }
      >
        Show toast
      </Button>
    )
  },
}
