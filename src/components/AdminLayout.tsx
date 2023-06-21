import { PropsWithChildren } from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminNav } from "./AdminNav"
import { useAuthContext } from "@/libs/auth"

export const AdminLayout = ({ children }: PropsWithChildren) => {
  const { isLoading } = useAuthContext()

  if (isLoading) {
    return <p>loading...</p>
  }

  return (
    <>
      <AdminHeader />
      <div className="flex min-h-full w-full">
        <AdminNav />
        <main className="w-full py-[72px] lg:w-[calc(100vw-160px)] lg:grow lg:px-4 lg:py-[100px]">
          <div className="w-full px-4 md:px-6 2xl:mx-auto 2xl:max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </>
  )
}
