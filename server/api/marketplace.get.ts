import { serverSupabaseClient } from '#supabase/server'
import groupBy from 'lodash.groupby'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const query = getQuery(event)

  const { data: collections } = await client
    .from('user_shared_collections')
    .select()
    .eq('published', true)
    .in('type', ['buy', 'sell'])
    .order('created_at', { ascending: false })

  if (collections?.length) {
    const { data: items } = await client
      .from('user_collection_items')
      .select()
      .in(
        'collection_id',
        collections.map((c: any) => c.id),
      )
      .match(query)

    const group = groupBy(items, 'collection_id')
    collections.forEach((collection: any) => {
      collection.items = group[collection.id] || []
    })
  }

  return collections?.filter((c: any) => c.items.length)
})
