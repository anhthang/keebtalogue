import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { params } = event.context

  const { data } = await client
    .from('user_collection_items')
    .delete()
    .eq('uid', params?.id)
    .eq('collection_id', params?.collection)
    .then(() =>
      client
        .from('user_collections')
        .delete()
        .eq('id', params?.collection)
        .eq('uid', params?.id),
    )

  return data
})
