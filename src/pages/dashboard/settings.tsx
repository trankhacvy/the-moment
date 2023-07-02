import type { ReactElement } from "react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Typography } from "@/components/ui/Typography"
import { NextPageWithLayout } from "@/types"
import { Routes } from "@/config/routes"
import Link from "next/link"
import { DashboardLayout } from "@/layouts/dashboard-layout"

const SettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Settings
        </Typography>
        <Breadcrumbs aria-label="Settings" separator={<span className="mx-2 h-1 w-1 rounded-sm bg-gray-500" />}>
          <Link href={Routes.DASHBOARD}>
            <Typography as="span" level="body4">
              Dashboard
            </Typography>
          </Link>
          <Typography as="span" level="body4" color="secondary">
            Settings
          </Typography>
        </Breadcrumbs>
      </div>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger className="grow-0 border-none outline-none" value="general">
            General
          </TabsTrigger>
          <TabsTrigger className="grow-0 border-none outline-none" value="billing">
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent className="rounded-lg border border-gray-300 p-4" value="general">
          General
        </TabsContent>
        <TabsContent className="rounded-lg border border-gray-300 p-4" value="billing">
          Billing
        </TabsContent>
      </Tabs>
    </>
  )
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default SettingsPage
