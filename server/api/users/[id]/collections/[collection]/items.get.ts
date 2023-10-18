import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data } = await client
    .from('user_collection_items')
    .select()
    .eq('uid', event.context.params.id)
    .eq('collection_id', event.context.params.collection)

  return sortBy(data, 'sculpt_name')
})
