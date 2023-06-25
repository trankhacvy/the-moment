import React from "react"

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: React.ReactNode
}

const Breadcrumbs = React.forwardRef<HTMLDivElement, BreadcrumbsProps>(
  ({ "aria-label": label, children, separator = "/", ...props }, ref) => {
    const allItems = React.Children.toArray(children)
      .filter((child) => {
        return React.isValidElement(child)
      })
      .map((child, index) => <li key={`child-${index}`}>{child}</li>)

    return (
      <nav aria-label={label} ref={ref} {...props}>
        <ol className="flex flex-wrap items-center">
          {allItems.reduce((acc: React.ReactNode[], current: React.ReactNode, index: number) => {
            if (index < allItems.length - 1) {
              acc = acc.concat(
                current,
                <li key={`separator-${index}`} aria-hidden className="flex select-none px-1.5">
                  {separator}
                </li>
              )
            } else {
              acc.push(current)
            }
            return acc
          }, [])}
        </ol>
      </nav>
    )
  }
)

Breadcrumbs.displayName = "Breadcrumbs"

export { Breadcrumbs }
