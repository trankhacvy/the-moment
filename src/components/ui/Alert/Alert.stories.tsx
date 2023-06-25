import type { Meta, StoryObj } from "@storybook/react"

import { Alert, AlertTitle, AlertDescription, AlertIcon, AlertClose } from "."
import { X, FileQuestionIcon } from "lucide-react"
import { IconButton } from "../IconButton"

const meta = {
  title: "components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    variant: "success",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "error", "warning"],
    },
  },
  render: (props) => (
    <Alert {...props}>
      <AlertIcon>
        <FileQuestionIcon />
      </AlertIcon>
      <div>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components and dependencies to your app using the cli.</AlertDescription>
      </div>
      <AlertClose>
        <IconButton size="sm">
          <X />
        </IconButton>
      </AlertClose>
    </Alert>
  ),
}
