import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data } = await client
    .from('user_collection_items')
    .delete()
    .eq('id', event.context.params.item)
    .eq('uid', event.context.params.id)
    .eq('collection_id', event.context.params.collection)

  return data
})
