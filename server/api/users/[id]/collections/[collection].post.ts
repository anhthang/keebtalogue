import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data } = await client
    .from('user_collections')
    .update(body)
    .eq('id', event.context.params?.collection)
    .eq('uid', event.context.params?.id)

  return data
})
