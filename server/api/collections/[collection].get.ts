import { serverSupabaseClient } from '#supabase/server'
import sortBy from 'lodash.sortby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: collection } = await client
    .from('user_shared_collections')
    .select()
    .eq('id', event.context.params.collection)
    .single()

  if (collection) {
    collection.items = []

    if (collection.published && collection.type === 'share') {
      const { data } = await client
        .from('user_collection_items')
        .select()
        .eq('collection_id', event.context.params.collection)

      collection.items = sortBy(data, 'sculpt_name')
    }
  }

  return collection
})
