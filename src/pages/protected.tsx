import useSWR from "swr"
import { client } from "@/libs/api"
import { AdminLayout } from "@/components/AdminLayout"

const Protected = () => {
  const { data, isLoading } = useSWR("demo", async () => {
    return client.getUsers()
  })
  console.log("pro", data)
  return <div>admin</div>
}

Protected.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>
}

export default Protected
