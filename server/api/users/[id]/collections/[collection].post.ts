import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data } = await client
    .from('user_collections')
    .update(body)
    .eq('id', event.context.params.collection)
    .eq('uid', event.context.params.id)

  if (body.published) {
    await client.from('user_shared_collections').insert(body)
  } else {
    await client
      .from('user_shared_collections')
      .delete()
      .eq('id', event.context.params.collection)
  }

  return data
})
