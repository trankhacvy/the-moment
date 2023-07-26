// import { createClient, SupabaseClient } from "@supabase/supabase-js"
// import { SUPABASE_API_KEY, SUPABASE_URL } from "@/config/env"
// import { Database } from "@/types/supabase.types"

// export const Supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY)

// export const uploadFile = async (client: SupabaseClient, filename: string, file: File) => {
//   const { data, error } = await client.storage.from("poap").upload(filename, file, {
//     upsert: true,
//   })
//   if (!data || error) {
//     return { data, error }
//   }
//   return client.storage.from("poap").getPublicUrl(filename)
// }
