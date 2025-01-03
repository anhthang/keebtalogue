import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client
    .from('user_collection_items')
    .select('*, artisan:colorways(*, sculpt:sculpts(name))')
    .eq('uid', event.context.params?.id)

  return data
})
