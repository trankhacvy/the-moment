import React, { HTMLAttributes } from "react"
import { Typography } from "@/components/ui/Typography"
import { cn } from "@/utils/cn"

type DropMethodItemProps = {
  icon: React.ReactNode
  name: string
  description: string
  active: boolean
} & HTMLAttributes<HTMLButtonElement>

export const DropMethodItem = React.forwardRef<HTMLButtonElement, DropMethodItemProps>((props, ref) => {
  const { icon, name, description, active, ...rest } = props

  return (
    <button
      ref={ref}
      className={cn(
        "flex gap-4 rounded-2xl bg-white shadow-card p-5 text-left transition-colors",
        { "cursor-not-allowed opacity-60": !active },
        { "hover:ring-2 hover:ring-gray-800": active }
      )}
      disabled={!active}
      {...rest}
    >
      {icon}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Typography as="h6" className="font-semibold">
            {name}
          </Typography>
          {!active && (
            <span className="flex h-6 min-w-[24px] items-center rounded-md bg-gray-500/16 px-1.5 text-xs font-semibold text-gray-700">
              Coming Soon
            </span>
          )}
        </div>
        <Typography color="secondary" level="body4">
          {description}
        </Typography>
      </div>
    </button>
  )
})
