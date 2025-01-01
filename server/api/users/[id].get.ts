import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client
    .from('users')
    .select(
      '*, collections:user_collections(*, total_items:user_collection_items(count))',
    )
    .eq('id', event.context.params?.id)
    .single()

  data?.collections.forEach((collection: any) => {
    collection.total_items = collection.total_items[0]?.count
  })

  return { data }
})
