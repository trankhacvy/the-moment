import { tv, VariantProps } from "tailwind-variants"
import React from "react"
import { cn } from "@/utils/cn"
import { forwardRefWithAs } from "@/utils/render"

export const buttonVariants = tv({
  base: [
    "inline-flex items-center justify-center rounded-lg shadow-z1 text-sm font-semibold transition-colors",
    "focus:outline-none focus:ring-4",
    "disabled:pointer-events-none",
    "active:scale-95",
  ],
  variants: {
    variant: {
      solid: [
        // "bg-primary-400 text-white", "hover:bg-primary-600", "focus:ring-primary-100", "disabled:bg-primary-200"
      ],
      outline: [
        "text-primary-400 border border-primary-400",
        "focus:ring-primary-100",
        "disabled:text-primary-300 disabled:border-primary-200",
      ],
      link: [
        "bg-transparent text-primary-600 focus:ring-0 shadow-none",
        "hover:text-primary-800 hover:bg-transparent",
        "disabled:text-gray-300",
      ],
    },
    size: {
      sm: "h-9 px-2 text-sm",
      md: "h-10 px-2.5 text-sm",
      lg: "h-11 px-2.5 text-base",
    },
    scheme: {
      default: "",
      primary: "",
      info: "",
      success: "",
      warning: "",
      error: "",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      scheme: "default",
      className: "bg-gray-800 text-white",
    },
    {
      variant: "solid",
      scheme: "primary",
      className: "bg-primary-400 text-white hover:bg-primary-600 focus:ring-primary-100 disabled:bg-primary-200",
    },
    {
      variant: "solid",
      scheme: "success",
      className: "bg-success-400 text-white hover:bg-sucess-600 focus:ring-sucess-100 disabled:bg-sucess-200",
    },
    {
      variant: "solid",
      scheme: "info",
      className: "bg-info-400 text-white hover:bg-info-600 focus:ring-info-100 disabled:bg-info-200",
    },
    {
      variant: "solid",
      scheme: "warning",
      className: "bg-warning-400 text-white hover:bg-warning-600 focus:ring-warning-100 disabled:bg-warning-200",
    },
    {
      variant: "solid",
      scheme: "error",
      className: "bg-error-400 text-white hover:bg-error-600 focus:ring-error-100 disabled:bg-error-200",
    },
  ],
  defaultVariants: {
    variant: "solid",
    scheme: "primary",
    size: "md",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  startDecorator?: React.ReactNode
  endDecorator?: React.ReactNode
  loading?: boolean
}

export const Button = forwardRefWithAs<"button", ButtonProps>(
  (
    {
      as: Tag = "button",
      className,
      variant,
      loading,
      fullWidth,
      size,
      children,
      startDecorator,
      endDecorator,
      disabled: disabledProp,
      scheme,
      ...props
    },
    ref
  ) => {
    const disabled = disabledProp || loading

    if (loading) {
      startDecorator = (
        <svg
          fill="currentColor"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin text-xl"
        >
          <g>
            <path d="M8,1V2.8A5.2,5.2,0,1,1,2.8,8H1A7,7,0,1,0,8,1Z" />
          </g>
        </svg>
      )
    }

    return (
      <Tag
        className={cn(buttonVariants({ variant, size, fullWidth, className, scheme }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {startDecorator && <span className="btn-icon mr-2">{startDecorator}</span>}
        {children}
        {endDecorator && <span className="btn-icon ml-2">{endDecorator}</span>}
      </Tag>
    )
  }
)
