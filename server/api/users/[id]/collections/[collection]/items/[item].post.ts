import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data } = await client
    .from('user_collection_items')
    .update(body)
    .eq('id', event.context.params?.item)
    .eq('uid', event.context.params?.id)

  return data
})
