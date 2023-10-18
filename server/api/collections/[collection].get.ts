import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: collection } = await client
    .from('user_collections')
    .select()
    .eq('id', event.context.params.collection)
    .single()

  if (collection && collection.published) {
    const { data } = await client
      .from('user_collection_items')
      .select()
      .eq('collection_id', event.context.params.collection)

    return sortBy(data, 'sculpt_name')
  }

  // TODO: need to show error message
  return []
})
